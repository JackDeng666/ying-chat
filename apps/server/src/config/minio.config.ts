import { registerAs } from '@nestjs/config'

export const minioConfig = registerAs('minioConfig', () => {
  if (!process.env.MINIO_HOST) {
    throw new Error('MINIO_HOST is not exist')
  }
  if (!process.env.MINIO_PORT) {
    throw new Error('MINIO_PORT is not exist')
  }
  if (!process.env.MINIO_ACCESS_KEY) {
    throw new Error('MINIO_ACCESS_KEY is not exist')
  }
  if (!process.env.MINIO_SECRET_KEY) {
    throw new Error('MINIO_SECRET_KEY is not exist')
  }
  return {
    host: process.env.MINIO_HOST,
    port: +process.env.MINIO_PORT,
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY
  }
})
