import { useContext } from 'react'
import { SocketContext } from './socket-provider'

export const useSocket = () => {
  return useContext(SocketContext)
}
