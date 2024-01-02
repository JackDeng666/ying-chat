import axios, { AxiosError } from 'axios'
import { toast } from 'sonner'

export const request = axios.create({
  baseURL: '/api'
})

export type ErrorRes = {
  status: number
  message: string | string[]
  timestamp?: string
  path?: string
  [key: string]: unknown
}

request.interceptors.request.use(config => {
  return config
})

request.interceptors.response.use(
  response => {
    if (response.data.data) {
      return response.data.data
    }
    return response.data
  },
  (error: AxiosError<ErrorRes>) => {
    const res = error.response
    if (res) {
      const msg = res.data.message
      if (Array.isArray(msg)) {
        toast.error(msg[0])
      } else {
        toast.error(msg)
      }
      return Promise.reject(res.data)
    }
    return Promise.reject(error)
  }
)
