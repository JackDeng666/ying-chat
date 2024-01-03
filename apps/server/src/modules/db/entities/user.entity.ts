import { Column, Entity } from 'typeorm'
import { Exclude, instanceToPlain } from 'class-transformer'
import { BaseEntity } from './base.entity'

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
  @Column({
    length: 32,
    unique: true
  })
  username: string

  @Column({
    length: 50,
    unique: true
  })
  email: string

  @Column()
  @Exclude()
  password: string

  @Column({
    length: 32,
    nullable: true
  })
  nickname: string

  toJSON() {
    return instanceToPlain(this)
  }
}
