import { describe, it, expect } from 'vitest'
import QRCodeLib from 'qrcode'
import { generateQrDataUrl, decodeQrFromImageData } from './logic'

describe('generateQrDataUrl', () => {
  it('produces a PNG data URL', async () => {
    const url = await generateQrDataUrl('hello world')
    expect(url).toMatch(/^data:image\/png;base64,/)
  })

  it('throws for input exceeding QR capacity', async () => {
    await expect(generateQrDataUrl('x'.repeat(5000))).rejects.toThrow()
  })
})

describe('decodeQrFromImageData', () => {
  it('decodes a QR code rasterized from the encoder\'s own module matrix', () => {
    const text = 'Toolify rocks'
    const qr = QRCodeLib.create(text, { errorCorrectionLevel: 'M' })
    const moduleCount = qr.modules.size
    const scale = 4
    const quietZone = 4 * scale
    const size = moduleCount * scale + quietZone * 2
    const data = new Uint8ClampedArray(size * size * 4).fill(255)
    for (let row = 0; row < moduleCount; row++) {
      for (let col = 0; col < moduleCount; col++) {
        if (!qr.modules.get(row, col)) continue
        for (let dy = 0; dy < scale; dy++) {
          for (let dx = 0; dx < scale; dx++) {
            const x = quietZone + col * scale + dx
            const y = quietZone + row * scale + dy
            const idx = (y * size + x) * 4
            data[idx] = 0
            data[idx + 1] = 0
            data[idx + 2] = 0
            data[idx + 3] = 255
          }
        }
      }
    }
    const result = decodeQrFromImageData({ data, width: size, height: size })
    expect(result).toBe(text)
  })

  it('returns null when no QR code is present', () => {
    const size = 50
    const data = new Uint8ClampedArray(size * size * 4).fill(255)
    expect(decodeQrFromImageData({ data, width: size, height: size })).toBeNull()
  })
})
