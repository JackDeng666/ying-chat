import { registerAs } from '@nestjs/config'

export const emailConfig = registerAs('emailConfig', () => {
  if (!process.env.EMAIl_HOST) {
    throw new Error('EMAIl_HOST is not exist')
  }
  if (!process.env.EMAIL_PORT) {
    throw new Error('EMAIL_PORT is not exist')
  }
  if (!process.env.EMAIL_USER) {
    throw new Error('EMAIL_USER is not exist')
  }
  if (!process.env.EMAIL_AUTH_CODE) {
    throw new Error('EMAIL_AUTH_CODE is not exist')
  }
  return {
    host: process.env.EMAIl_HOST,
    port: +process.env.EMAIL_PORT,
    user: process.env.EMAIL_USER,
    code: process.env.EMAIL_AUTH_CODE
  }
})
