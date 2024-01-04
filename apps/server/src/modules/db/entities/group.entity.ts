import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne
} from 'typeorm'
import { UserEntity } from './user.entity'
import { FileEntity } from './file.entity'
import { BaseEntity } from './base.entity'

@Entity({ name: 'group' })
export class GroupEntity extends BaseEntity {
  @Column({
    length: 32
  })
  name: string

  @Column({
    length: 100,
    nullable: true
  })
  description: string

  @Column({
    length: 32,
    unique: true
  })
  inviteCode: string

  @Column()
  coverId: number

  @OneToOne(() => FileEntity)
  @JoinColumn()
  cover: FileEntity

  @Column()
  createById: number

  @ManyToOne(() => UserEntity)
  @JoinColumn()
  createBy: UserEntity

  @ManyToMany(() => UserEntity)
  @JoinTable({
    name: 'group_conversation',
    synchronize: false
  })
  users: UserEntity[]
}
