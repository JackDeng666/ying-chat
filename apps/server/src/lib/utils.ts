import { createHash } from 'crypto'

export function generatePass(pass: string) {
  const sha1 = createHash('sha1')
  const ciphertext = sha1.update(pass).digest('hex')
  return ciphertext
}

export function comparePass(pass: string, encryptPass: string) {
  const sha1 = createHash('sha1')
  const ciphertext = sha1.update(pass).digest('hex')
  return ciphertext === encryptPass
}
