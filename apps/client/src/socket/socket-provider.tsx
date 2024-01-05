import React, { createContext, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuthStore, resetAuth } from '@/stores'

type TSocketContext = {
  socket: Socket | undefined
  connected: boolean
}

export const SocketContext = createContext<TSocketContext>({
  socket: undefined,
  connected: false
})

const useSocketIo = () => {
  const [socket, setSocket] = useState<Socket | undefined>()
  const [connected, setConnected] = useState(false)

  const token = useAuthStore(state => state.token)

  useEffect(() => {
    const socket = io({
      extraHeaders: {
        authorization: token
      }
    })

    socket.on('connect', () => {
      console.log('cc')
      setConnected(true)
    })
    socket.on('disconnect', () => {
      setConnected(false)
    })

    socket.on('authFail', () => {
      resetAuth()
    })

    setSocket(socket)

    return () => {
      socket.disconnect()
    }
  }, [token])

  return {
    socket,
    connected
  }
}

type SocketProviderProps = {
  children: React.ReactNode
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const { socket, connected } = useSocketIo()

  return (
    <SocketContext.Provider value={{ socket, connected }}>
      {children}
    </SocketContext.Provider>
  )
}
