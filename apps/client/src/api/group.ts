import { CreateGroupDto, FileVo, GroupVo, GroupListVo } from '@ying-chat/shared'
import { request } from './request'

export function createGroup(groupDto: CreateGroupDto): Promise<GroupVo> {
  return request.post('/group', groupDto)
}

export function uploadGroupCover(file: File): Promise<FileVo> {
  const form = new FormData()
  form.append('file', file)
  return request.post('/group/cover', form)
}

export function joinGroup(inviteCode: string): Promise<null> {
  return request.get(`/group/join/${inviteCode}`)
}

export function getUserGroupList(): Promise<GroupListVo> {
  return request.get('/group/list')
}

export function getGroupInfo(id: string): Promise<GroupVo> {
  return request.get(`/group/${id}`)
}
