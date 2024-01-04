import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'

export type IntersectingCallback = () => void

export type UnObserverCallback = () => void

type TScrollBoxContext = {
  observer:
    | ((el: Element, func: IntersectingCallback) => UnObserverCallback)
    | undefined
}

export const useIntersectionObserver = () => {
  const [intersectionObserver, setIntersectionObserver] =
    useState<IntersectionObserver>()

  const mapRef = useRef(new Map<Element, IntersectingCallback>())

  useEffect(() => {
    const intersectionObserver = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const element = entry.target
            const func = mapRef.current.get(element)
            func && func()
          }
        }
      },
      {
        threshold: 0.6
      }
    )
    setIntersectionObserver(intersectionObserver)
  }, [])

  const observer = useCallback(
    (el: Element, func: IntersectingCallback) => {
      intersectionObserver?.observe(el)
      mapRef.current.set(el, func)

      return () => {
        intersectionObserver?.unobserve(el)
        mapRef.current.delete(el)
      }
    },
    [intersectionObserver]
  )

  return {
    observer
  }
}

export const useObserver = () => {
  return useContext(ScrollBoxContext)
}

export const ScrollBoxContext = createContext<TScrollBoxContext>({
  observer: undefined
})
