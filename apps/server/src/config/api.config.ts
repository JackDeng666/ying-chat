import { registerAs } from '@nestjs/config'

export const apiConfig = registerAs('apiConfig', () => {
  return {
    port: process.env.SERVER_PORT || 3000,
    prefix: process.env.SERVER_PREFIX || 'api'
  }
})
