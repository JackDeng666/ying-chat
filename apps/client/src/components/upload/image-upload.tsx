import { useState } from 'react'
import { Plus } from 'lucide-react'
import { CircularProgress, cn } from '@nextui-org/react'
import { FileVo } from '@ying-chat/shared'
import { SelectFileType, useUpload } from './use-upload'

type MinioUploadProps = {
  handleUpload: (file: File) => Promise<FileVo>
  defaultUrl?: string
  onSuccess?: (file: FileVo) => void
}

export const ImageUpload = ({
  defaultUrl,
  onSuccess,
  handleUpload
}: MinioUploadProps) => {
  const [url, setUrl] = useState(defaultUrl)

  const { loading, start } = useUpload({
    handleUpload,
    onSuccess: minioFile => {
      setUrl(minioFile.url)
      onSuccess && onSuccess(minioFile)
    }
  })

  return (
    <div
      className="inline-block w-[110px] h-[110px] cursor-pointer"
      onClick={() => {
        start(SelectFileType.Image)
      }}
    >
      {url ? (
        <img className="w-full h-full rounded-full object-cover" src={url} />
      ) : (
        <div
          className={cn(
            'w-full h-full rounded-full border-dashed text-2xl fc border-2',
            'bg-content2 text-foreground-500 border-foreground-500'
          )}
        >
          {loading ? <CircularProgress /> : <Plus />}
        </div>
      )}
    </div>
  )
}
