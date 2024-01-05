import { create } from 'zustand'

type PreviewType = 'image' | 'video'

type PreviewStore = {
  type: PreviewType
  url: string
  open: boolean
}

export const usePreview = create<PreviewStore>(() => ({
  type: 'image',
  url: '',
  open: false
}))

export const openPreview = (type: PreviewType, url: string) => {
  usePreview.setState({ open: true, type, url })
}

export const closePreview = () => {
  usePreview.setState({ open: false })
}
