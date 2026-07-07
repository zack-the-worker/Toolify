use serde::Serialize;
use x509_parser::oid_registry::OidRegistry;
use x509_parser::prelude::*;
use x509_parser::public_key::PublicKey;

use crate::tools::json::JsonError;

#[derive(Serialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct CertificateInfo {
    pub subject: String,
    pub issuer: String,
    pub serial_number: String,
    pub signature_algorithm: String,
    pub not_before: String,
    pub not_after: String,
    pub public_key_algorithm: String,
    pub public_key_bits: Option<u32>,
    pub version: u32,
    pub is_ca: bool,
}

fn oid_name(registry: &OidRegistry, oid: &x509_parser::der_parser::oid::Oid) -> String {
    registry
        .get(oid)
        .map(|e| e.sn().to_string())
        .unwrap_or_else(|| oid.to_string())
}

fn format_asn1_time(t: &ASN1Time) -> String {
    chrono::DateTime::from_timestamp(t.timestamp(), 0)
        .map(|d| d.to_rfc3339())
        .unwrap_or_else(|| t.to_string())
}

#[tauri::command]
pub fn decode_certificate(pem_input: String) -> Result<CertificateInfo, JsonError> {
    let pem = ::pem::parse(pem_input.trim()).map_err(|e| JsonError::from_message(e.to_string()))?;
    let (_, cert) = X509Certificate::from_der(&pem.contents())
        .map_err(|e| JsonError::from_message(e.to_string()))?;

    let registry = OidRegistry::default().with_all_crypto();

    let sig_alg = oid_name(&registry, &cert.signature_algorithm.algorithm);
    let pubkey_alg = oid_name(&registry, &cert.public_key().algorithm.algorithm);
    let pubkey_bits = match cert.public_key().parsed() {
        Ok(PublicKey::RSA(rsa)) => Some(rsa.key_size() as u32),
        _ => None,
    };

    Ok(CertificateInfo {
        subject: cert.subject().to_string(),
        issuer: cert.issuer().to_string(),
        serial_number: cert.raw_serial_as_string(),
        signature_algorithm: sig_alg,
        not_before: format_asn1_time(&cert.validity().not_before),
        not_after: format_asn1_time(&cert.validity().not_after),
        public_key_algorithm: pubkey_alg,
        public_key_bits: pubkey_bits,
        version: cert.version().0,
        is_ca: cert.is_ca(),
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    // Self-signed test certificate generated locally with:
    //   openssl req -x509 -newkey rsa:2048 -nodes -days 3650 \
    //     -subj "/C=US/ST=CA/O=Toolify Test/CN=toolify.test"
    // Not a secret; just a throwaway fixture for parsing tests.
    const TEST_CERT_PEM: &str = "-----BEGIN CERTIFICATE-----\n\
MIIDcTCCAlmgAwIBAgIUePKdTR5y505OIir1wKGUpaon9TIwDQYJKoZIhvcNAQEL\n\
BQAwSDELMAkGA1UEBhMCVVMxCzAJBgNVBAgMAkNBMRUwEwYDVQQKDAxUb29saWZ5\n\
IFRlc3QxFTATBgNVBAMMDHRvb2xpZnkudGVzdDAeFw0yNjA3MDcwNDQ2MDJaFw0z\n\
NjA3MDQwNDQ2MDJaMEgxCzAJBgNVBAYTAlVTMQswCQYDVQQIDAJDQTEVMBMGA1UE\n\
CgwMVG9vbGlmeSBUZXN0MRUwEwYDVQQDDAx0b29saWZ5LnRlc3QwggEiMA0GCSqG\n\
SIb3DQEBAQUAA4IBDwAwggEKAoIBAQDJMYaQR6l03DI+VXWRqI9iR/OF1P/5f43Z\n\
RZNzjXBARz+M2uipdM+uKkSqTx5D5QjBasPlaPT8rS96asReGW8dS+ZufGC9nvgM\n\
ANgXkiduNacqsD8nIweGnohfx9f94EHVIvWibgJUZ7h0uuiF3I+IxU41xhaEXmaX\n\
uo4GkAAEnVr7xz8GhvWT7m6ORyty5o1viHcEiM2F3rtR8jWbPDGk4ZqQiWGPGgK9\n\
WRtcbQV1Pbew3Q04nJDn7ipC7FPlOwyC7RULubqzc6iBr4qDdjWXmTOPdteW01rC\n\
iiUyZoDSbnECZTNY0OiGc1K8O8wfn8v+qvoANfe33Y1ymdfcHYtVAgMBAAGjUzBR\n\
MB0GA1UdDgQWBBTHMqB3vM0wDfiM0Maa2kPz3rXf+TAfBgNVHSMEGDAWgBTHMqB3\n\
vM0wDfiM0Maa2kPz3rXf+TAPBgNVHRMBAf8EBTADAQH/MA0GCSqGSIb3DQEBCwUA\n\
A4IBAQBuISkojXCXYJXI7KS5skq1R7iiQM5W2nEpVsrGw0718U3DHuoAHoRrCjfo\n\
FzJPexipKTHnQ+OEemEeMANRCpDF7d1tshh/kMisL4gC1hfpmSCuwKOXUWHRTpl9\n\
KvqZ2Kk3uOJk7gK2yj9Wr4gHnnL7laST07PxLb/1j0/0EAoJLtZGjLontOUsp0uq\n\
s7pJ+KNi07qXA2AGrhASlJ63nKPFEkNYCjujkCZYdBv3p5oUsbmDAx70e92+XQ2I\n\
kY1d6TMNg9MVf1qtsS7NzyxrWM0MaNYret9PICk8wgXHeaj3sj1bkRr4Q3rT3XHy\n\
SUOF5/l1uuY7Y5cyyyqqjFSXWJzq\n\
-----END CERTIFICATE-----\n";

    #[test]
    fn decodes_subject_and_issuer_of_a_self_signed_cert() {
        let info = decode_certificate(TEST_CERT_PEM.to_string()).unwrap();
        assert!(info.subject.contains("toolify.test"));
        assert!(info.issuer.contains("toolify.test"));
        assert_eq!(info.subject, info.issuer); // self-signed
    }

    #[test]
    fn reports_serial_number_and_signature_algorithm() {
        let info = decode_certificate(TEST_CERT_PEM.to_string()).unwrap();
        assert!(!info.serial_number.is_empty());
        assert!(info.signature_algorithm.to_lowercase().contains("sha256"));
    }

    #[test]
    fn reports_validity_period() {
        let info = decode_certificate(TEST_CERT_PEM.to_string()).unwrap();
        assert!(info.not_before.starts_with("2026-07-07"));
        assert!(info.not_after.starts_with("2036-07-04"));
    }

    #[test]
    fn reports_public_key_info() {
        let info = decode_certificate(TEST_CERT_PEM.to_string()).unwrap();
        assert!(info.public_key_algorithm.to_lowercase().contains("rsa"));
        assert_eq!(info.public_key_bits, Some(2048));
    }

    #[test]
    fn rejects_malformed_input() {
        let err = decode_certificate("not a certificate".to_string()).unwrap_err();
        assert!(!err.message.is_empty());
    }
}
