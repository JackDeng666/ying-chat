import { create } from 'zustand'
import { nanoid } from 'nanoid'
import { authApi } from '@/api'
import { toast } from 'sonner'
import { LoginDto, UserVo } from '@ying-chat/shared'

export const SESSION_UID = 'session-uid'

export const TOKEN = 'token'

export const USER_INFO = 'user-info'

export const useAuthStore = create(() => {
  let sessionUid = sessionStorage.getItem(SESSION_UID) || ''
  if (!sessionUid) {
    sessionUid = nanoid()
    sessionStorage.setItem(SESSION_UID, sessionUid)
  }

  const token = localStorage.getItem(TOKEN) || ''

  const userInfoStr = localStorage.getItem(USER_INFO)
  let userInfo: UserVo | null = null
  if (userInfoStr) {
    userInfo = JSON.parse(userInfoStr)
  }

  return {
    sessionUid,
    token,
    userInfo
  }
})

export const setUserInfo = (userInfo: UserVo) => {
  localStorage.setItem(USER_INFO, JSON.stringify(userInfo))
  useAuthStore.setState({ userInfo })
}

export const login = async (loginDto: LoginDto) => {
  const data = await authApi.login(loginDto)
  localStorage.setItem(TOKEN, data.token)
  localStorage.setItem(USER_INFO, JSON.stringify(data.user))
  useAuthStore.setState({ token: data.token, userInfo: data.user })
}

export const logout = async () => {
  try {
    await authApi.logout()
    resetAuth()
    toast.success('logout success!')
  } catch {}
}

export const resetAuth = () => {
  localStorage.removeItem(TOKEN)
  localStorage.removeItem(USER_INFO)
  useAuthStore.setState({ token: '', userInfo: null })
}
