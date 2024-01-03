import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores'

export const useAuthRoute = (children: React.ReactElement) => {
  const token = useAuthStore(state => state.token)

  if (!token) {
    return <Navigate to="/login" />
  }

  return <>{children}</>
}
