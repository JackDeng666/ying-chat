import { useContext } from 'react'
import { RouterContext } from '.'

export const useRouterContext = () => {
  return useContext(RouterContext)
}
