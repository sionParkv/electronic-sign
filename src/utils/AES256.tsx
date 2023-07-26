import crypto from 'crypto'

import { cfgServer } from '@/config'

const key = cfgServer.key

const AES_encrypt = (data: any) => {
  const iv = Buffer.alloc(16, 0) // 16비트
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv)
  let encryptedText = cipher.update(data, 'utf8', 'base64')
  encryptedText += cipher.final('base64')
  return encryptedText
}
const AES_decrypt = (data: any) => {
  const iv = Buffer.alloc(16, 0) // 16비트
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv)
  let decryptedText = decipher.update(data, 'base64', 'utf8')
  decryptedText += decipher.final('utf8')
  return decryptedText
}

const AES256 = {
  AES_encrypt,
  AES_decrypt
}
export { AES256 }
