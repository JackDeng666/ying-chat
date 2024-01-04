import { FileVo } from './file.vo'
import { UserVo } from './user.vo'

export type GroupVo = {
  id: number
  name: string
  description?: string
  inviteCode?: string
  coverId: number
  cover: FileVo
  createById: number
  createAt: string
  updateAt: string
  users?: UserVo[]
}

export type GroupListVo = {
  owner: GroupVo[]
  member: GroupVo[]
}
