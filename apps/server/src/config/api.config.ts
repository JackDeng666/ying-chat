import { registerAs } from '@nestjs/config'

export const apiConfig = registerAs('apiConfig', () => {
  return {
    port: process.env.SERVER_PORT || 3000,
    jwtSecret: process.env.SERVER_JWT_SECRET || ''
  }
})
