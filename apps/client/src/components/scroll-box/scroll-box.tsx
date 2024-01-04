import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef
} from 'react'
import { cn } from '@nextui-org/react'
import { debounce } from '@/utils'
import { ScrollBoxContext, useIntersectionObserver } from './scroll-provider'

type ScollBoxProps = {
  children: React.ReactNode
  className?: string
  onTop?: () => void
  onBottom?: () => void
}

export type ScollBoxHandle = {
  scrollToBottom: (behavior?: ScrollBehavior) => void
  getDistanceFromBottom: () => number
  keepBottom: (callback: () => void) => void
  keepPosition: (callback: () => void) => void
}

export const ScollBox = forwardRef<ScollBoxHandle, ScollBoxProps>(
  ({ children, className, onTop, onBottom }, ref) => {
    const scrollDivRef = useRef<HTMLDivElement>(null)
    const originHeight = useRef(0)
    const { observer } = useIntersectionObserver()

    const scrollToBottom = (behavior: ScrollBehavior = 'instant') => {
      scrollDivRef.current?.scrollTo({
        top: scrollDivRef.current.scrollHeight,
        behavior
      })
    }

    const getDistanceFromBottom = () => {
      const dom = scrollDivRef.current
      if (!dom) return 0
      return dom.scrollHeight - dom.scrollTop - dom.clientHeight
    }

    const keepBottom = (callback: () => void) => {
      const distanceFromBottom = getDistanceFromBottom()

      callback()

      setTimeout(() => {
        if (distanceFromBottom <= 300) {
          scrollToBottom('smooth')
        } else {
          scrollToBottom('instant')
        }
      })
    }

    const keepPosition = async (callback: () => void) => {
      const dom = scrollDivRef.current
      if (!dom) return

      originHeight.current = dom.scrollHeight
      callback()
    }

    useLayoutEffect(() => {
      const dom = scrollDivRef.current
      if (!dom) return

      if (originHeight.current) {
        dom.scrollTo({
          top: dom.scrollHeight - originHeight.current
        })
        originHeight.current = 0
      }
    }, [children])

    useImperativeHandle(
      ref,
      () => ({
        scrollToBottom,
        getDistanceFromBottom,
        keepBottom,
        keepPosition
      }),
      []
    )

    useEffect(() => {
      const dom = scrollDivRef.current
      if (!dom) return

      const scollCallback = debounce<Event>((e: Event) => {
        const el = e.target as HTMLDivElement,
          scrollTop = el.scrollTop,
          scrollHeight = el.scrollHeight,
          offsetHeight = el.offsetHeight
        if (onTop && scrollTop <= 0) {
          onTop()
        } else if (onBottom && offsetHeight + scrollTop + 5 >= scrollHeight) {
          onBottom()
        }
      }, 200)

      dom.addEventListener('scroll', scollCallback)

      return () => {
        dom.removeEventListener('scroll', scollCallback)
      }
    }, [onTop, onBottom, observer])

    return (
      <ScrollBoxContext.Provider value={{ observer }}>
        <div
          id="scroll-box"
          className={cn('overflow-y-auto scroll-box', className)}
          ref={scrollDivRef}
          aria-label="scrollbox"
        >
          {children}
        </div>
      </ScrollBoxContext.Provider>
    )
  }
)
