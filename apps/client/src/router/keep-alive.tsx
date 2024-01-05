import { ReactElement, useContext, useRef } from 'react'
import { Freeze } from 'react-freeze'
import { UNSAFE_RouteContext as RouteContext } from 'react-router-dom'

export const KeepAliveOutlet = () => {
  const caches = useRef<Record<string, ReactElement>>({})

  const routeContext = useContext(RouteContext)
  const matchedElement = routeContext.outlet
  const matchedPath = matchedElement?.props?.match?.pathname

  if (matchedElement && matchedPath) {
    caches.current[matchedPath] = matchedElement
  }

  return (
    <>
      {Object.entries(caches.current).map(([path, element]) => (
        <Freeze key={path} freeze={element !== matchedElement}>
          {element}
        </Freeze>
      ))}
    </>
  )
}
