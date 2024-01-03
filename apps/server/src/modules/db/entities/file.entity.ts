import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { FileType } from '@ying-chat/shared'
import { BaseEntity, UserEntity } from '.'

@Entity({ name: 'file' })
export class FileEntity extends BaseEntity {
  @Column({
    length: 50,
    unique: true
  })
  path: string

  @Column({
    type: 'enum',
    enum: FileType
  })
  type: FileType

  @Column({
    length: 2083
  })
  url: string

  @Column()
  createById: number

  @ManyToOne(() => UserEntity)
  @JoinColumn()
  createBy: UserEntity
}
