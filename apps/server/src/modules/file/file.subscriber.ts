import { Inject } from '@nestjs/common'
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  Repository
} from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { Client } from 'minio'
import {
  BUCKET_NAME,
  EXPIR_SECONDS,
  MINIO_TOKEN
} from '@/modules/file/constant'
import { FileEntity } from '@/modules/db/entities'

@EventSubscriber()
export class FileSubscriber implements EntitySubscriberInterface<FileEntity> {
  constructor(
    dataSource: DataSource,
    @Inject(MINIO_TOKEN)
    private readonly minioClient: Client,
    @InjectRepository(FileEntity)
    private readonly minioFileRepository: Repository<FileEntity>
  ) {
    dataSource.subscribers.push(this)
  }

  listenTo() {
    return FileEntity
  }

  async afterLoad(entity: FileEntity) {
    try {
      if (
        Date.now() - new Date(entity.updateAt).getTime() >
        EXPIR_SECONDS * 1000
      ) {
        const newUrl = await this.minioClient.presignedUrl(
          'get',
          BUCKET_NAME,
          entity.path,
          EXPIR_SECONDS
        )
        entity.url = newUrl
        this.minioFileRepository.update({ id: entity.id }, { url: newUrl })
      }
    } catch (error) {
      console.error(error)
    }
  }
}
