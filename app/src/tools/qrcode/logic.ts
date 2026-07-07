import QRCode from 'qrcode'
import jsQR from 'jsqr'

export function generateQrDataUrl(text: string): Promise<string> {
  return QRCode.toDataURL(text, { margin: 2, width: 320 })
}

export interface SimpleImageData {
  data: Uint8ClampedArray
  width: number
  height: number
}

export function decodeQrFromImageData(image: SimpleImageData): string | null {
  const result = jsQR(image.data, image.width, image.height)
  return result ? result.data : null
}
