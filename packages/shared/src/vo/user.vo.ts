import { FileVo } from './file.vo'

export type UserVo = {
  id: number
  username: string
  email: string
  nickname: string
  createAt: string
  updateAt: string
  avatarId?: number
  avatar?: FileVo
}
