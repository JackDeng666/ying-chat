import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Client } from 'minio'
import { ConfigType } from '@nestjs/config'
import { minioConfig } from '@/config'
import { FileEntity } from '@/modules/db/entities'
import { FileService } from './file.service'
import { BUCKET_NAME, MINIO_TOKEN } from './constant'
import { FileSubscriber } from './file.subscriber'

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([FileEntity])],
  providers: [
    {
      provide: MINIO_TOKEN,
      async useFactory(minioConf: ConfigType<typeof minioConfig>) {
        const minioClient = new Client({
          endPoint: minioConf.host,
          port: minioConf.port,
          useSSL: false,
          accessKey: minioConf.accessKey,
          secretKey: minioConf.secretKey
        })
        const bucketExists = await minioClient.bucketExists(BUCKET_NAME)
        if (!bucketExists) {
          minioClient.makeBucket(BUCKET_NAME)
        }
        return minioClient
      },
      inject: [minioConfig.KEY]
    },
    FileService,
    FileSubscriber
  ],
  exports: [FileService]
})
export class FileModule {}
