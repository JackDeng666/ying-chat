import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Client, ItemBucketMetadata } from 'minio'
import { nanoid } from 'nanoid'
import { FileType } from '@ying-chat/shared'
import { FileEntity } from '@/modules/db/entities'
import { BUCKET_NAME, EXPIR_SECONDS, MINIO_TOKEN } from './constant'

type UploadFileOptions = {
  file: Express.Multer.File
  fileType: FileType
  userId: number
  meteData?: ItemBucketMetadata
}

@Injectable()
export class FileService {
  @Inject(MINIO_TOKEN)
  private readonly minioClient: Client

  @InjectRepository(FileEntity)
  private readonly minioFileRepository: Repository<FileEntity>

  async uploadFile({ file, fileType, userId, meteData }: UploadFileOptions) {
    const fileName = nanoid()
    const objectName = `${fileType}/${fileName}`

    await this.minioClient.putObject(BUCKET_NAME, objectName, file.buffer, {
      'Content-Type': file.mimetype,
      userId,
      ...meteData
    })
    const url = await this.getPresignedUrl(objectName)

    const minioFile = this.minioFileRepository.create({
      type: fileType,
      path: objectName,
      url,
      createById: userId
    })
    await this.minioFileRepository.save(minioFile)

    return minioFile
  }

  getPresignedUrl(objectName: string) {
    return this.minioClient.presignedUrl(
      'get',
      BUCKET_NAME,
      objectName,
      EXPIR_SECONDS
    )
  }
}
