import { LoginDto, LoginVo, RegisterDto } from '@ying-chat/shared'
import { request } from './request'

export function register(body: RegisterDto) {
  return request.post('/auth/register', body)
}

export async function sendCode(email: string) {
  return request.post('/auth/sendCode', { email })
}

export async function getCaptcha(uid: string): Promise<string> {
  return request.get('auth/catpcha', {
    params: { uid },
    headers: { Accept: 'text/plain' }
  })
}

export function login(body: LoginDto): Promise<LoginVo> {
  return request.post('/auth/login', body)
}

export function logout() {
  return request.get('/auth/logout')
}
