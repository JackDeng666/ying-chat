import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm'
import { GroupMessageType } from '@ying-chat/shared'
import { BaseEntity } from './base.entity'
import { UserEntity } from './user.entity'
import { FileEntity } from './file.entity'

@Entity({ name: 'group_message' })
export class GroupMessageEntity extends BaseEntity {
  @Column({
    type: 'enum',
    enum: GroupMessageType,
    comment: '0 Text; 1 Image; 2 Video'
  })
  type: GroupMessageType

  @Column({
    type: 'text',
    nullable: true
  })
  content?: string

  @Column()
  userId: number

  @ManyToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity

  @Column()
  groupId: number

  @Column({
    nullable: true
  })
  coverId?: number

  @OneToOne(() => FileEntity)
  @JoinColumn()
  cover?: FileEntity

  @Column({
    nullable: true
  })
  fileId?: number

  @OneToOne(() => FileEntity)
  @JoinColumn()
  file?: FileEntity
}
