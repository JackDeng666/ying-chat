import { RegisterDto } from '@ying-chat/shared'
import { request } from './request'

export function register(body: RegisterDto) {
  return request.post('/auth/register', body)
}

export async function sendCode(email: string) {
  return request.post('/auth/sendCode', { email })
}
