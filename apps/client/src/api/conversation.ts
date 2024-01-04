import {
  ConversationVo,
  GroupMessageListDto,
  GroupMessageVo,
  SendMsgDto
} from '@ying-chat/shared'
import { request } from './request'

export function getConversationList(): Promise<ConversationVo[]> {
  return request.get('/conversation/list')
}

export function getGroupConversationMessageList(
  query: GroupMessageListDto
): Promise<GroupMessageVo[]> {
  return request.get('/conversation/group/message/list', { params: query })
}

export function sendTextGroupMessage(dto: SendMsgDto): Promise<GroupMessageVo> {
  return request.post('/conversation/group/message/text', dto)
}

export function sendImageGroupMessage(
  file: File,
  groupId: string
): Promise<GroupMessageVo> {
  const form = new FormData()
  form.append('file', file)
  form.append('groupId', groupId)
  return request.post('/conversation/group/message/image', form)
}

export function sendVideoGroupMessage(
  file: File,
  coverFile: File,
  groupId: string
): Promise<GroupMessageVo> {
  const form = new FormData()
  form.append('file', file)
  form.append('coverFile', coverFile)
  form.append('groupId', groupId)
  return request.post('/conversation/group/message/video', form)
}
