import React from 'react'
import { PlusCircle } from 'lucide-react'
import { SelectFileType, selectFile } from '@/components/upload'
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem
} from '@nextui-org/react'

type ChatSelectFileProps = {
  onFileSelect: (file: File, type: SelectFileType) => void
}

export const ChatSelectFile: React.FC<ChatSelectFileProps> = ({
  onFileSelect
}) => {
  return (
    <Dropdown backdrop="opaque">
      <DropdownTrigger>
        <PlusCircle className="cursor-pointer" />
      </DropdownTrigger>
      <DropdownMenu aria-label="Message Actions">
        <DropdownItem
          key="Image"
          onClick={() => {
            selectFile(SelectFileType.Image).then(file => {
              onFileSelect(file, SelectFileType.Image)
            })
          }}
        >
          Image
        </DropdownItem>
        <DropdownItem
          key="Video"
          onClick={() => {
            selectFile(SelectFileType.Video).then(file => {
              onFileSelect(file, SelectFileType.Video)
            })
          }}
        >
          Video
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}
