import { UpdateUserDto, UserVo } from '@ying-chat/shared'
import { request } from './request'

export function getUserInfo(): Promise<UserVo> {
  return request.get('/user')
}

export function updateUserInfo(updateUserInfoDto: UpdateUserDto) {
  return request.post('/user', updateUserInfoDto)
}
