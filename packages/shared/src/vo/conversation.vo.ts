import { GroupMessageType } from '../enum'
import { FileVo } from './file.vo'
import { GroupVo } from './group.vo'
import { UserVo } from './user.vo'

export type ConversationVo = {
  id: number
  userId: number
  groupId: number
  group: GroupVo
  lastMsgId: number
  unreadNum: number
  recentMsg?: GroupMessageVo
}

export type GroupMessageVo = {
  id: number
  type: GroupMessageType
  content: string
  groupId: number
  coverId?: number
  cover?: FileVo
  fileId?: number
  file?: FileVo
  userId: number
  user: UserVo
  createAt: string
  updateAt: string
}
