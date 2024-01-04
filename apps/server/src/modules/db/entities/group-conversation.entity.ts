import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { GroupRoleType } from '@ying-chat/shared'
import { BaseEntity } from './base.entity'
import { UserEntity } from './user.entity'
import { GroupEntity } from './group.entity'

@Entity({ name: 'group_conversation' })
export class GroupConversationEntity extends BaseEntity {
  @Column({
    type: 'enum',
    enum: GroupRoleType,
    comment: '0 Owner; 1 Member;'
  })
  userRole: GroupRoleType

  @Column({
    nullable: true
  })
  lastMsgId: number

  unreadNum?: number

  @PrimaryColumn()
  userId: number

  @ManyToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity

  @PrimaryColumn()
  groupId: number

  @ManyToOne(() => GroupEntity)
  @JoinColumn()
  group: GroupEntity
}
