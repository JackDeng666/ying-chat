import { createContext, useEffect } from 'react'
import { useLocation, useRoutes } from 'react-router-dom'
import { routes } from './routes'

type keyType = '/contact' | '/conversation'
type CacheType = Record<keyType, string>

const routeKeyCache: CacheType = {
  '/contact': '/contact',
  '/conversation': '/conversation'
}

const setRouteKeyCache = (key: keyType, value: string) => {
  routeKeyCache[key] = value
}

type RouterContextType = {
  routeKeyCache: CacheType
}

export const RouterContext = createContext<RouterContextType>({
  routeKeyCache
})

export const RouterProvider = () => {
  const routesElements = useRoutes(routes)
  const { pathname } = useLocation()

  useEffect(() => {
    if (pathname.startsWith('/contact')) {
      setRouteKeyCache('/contact', pathname)
    }

    if (pathname.startsWith('/conversation')) {
      setRouteKeyCache('/conversation', pathname)
    }
  }, [pathname])

  return (
    <RouterContext.Provider
      value={{
        routeKeyCache
      }}
    >
      {routesElements}
    </RouterContext.Provider>
  )
}
