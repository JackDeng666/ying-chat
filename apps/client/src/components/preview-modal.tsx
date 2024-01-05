import { Modal, ModalContent } from '@nextui-org/react'
import { usePreview, closePreview } from '@/stores'

export const PreviewModal = () => {
  const { open, url, type } = usePreview()

  return (
    <Modal
      isOpen={open}
      onClose={() => closePreview()}
      className="bg-transparent"
      size="full"
      classNames={{ closeButton: 'top-5 right-5' }}
    >
      <ModalContent className="fc">
        {type === 'image' ? (
          <img src={url} className="max-w-full h-[80%] object-cover" />
        ) : (
          <video className="max-w-full h-[80%]" src={url} controls autoPlay />
        )}
      </ModalContent>
    </Modal>
  )
}
