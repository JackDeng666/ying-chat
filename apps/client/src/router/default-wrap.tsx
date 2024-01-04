import React from 'react'

export const DefaultWrap = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="h-full fc bg-content3 dark:bg-content3">{children}</div>
  )
}
