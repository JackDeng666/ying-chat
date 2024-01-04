import React, { useEffect, useRef, useState } from 'react'
import { Textarea } from '@nextui-org/react'
import { Loader2, SendHorizontal } from 'lucide-react'
import { toast } from 'sonner'
import { GroupMessageType } from '@ying-chat/shared'
import { SelectFileType } from '@/components/upload'
import { ChatEmoji } from './chat-emoji'
import { ChatSelectFile } from './chat-select-file'

type ChatInputProps = {
  onSend: (type: GroupMessageType, content: string | File) => Promise<void>
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend }) => {
  const [inputValue, setInputValue] = useState('')
  const [sendLoading, setSendLoading] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const sendTextMsg = () => {
    if (!inputValue) {
      return toast.warning('Please enter the message content!')
    }
    send(GroupMessageType.Text, inputValue)
  }

  const send = async (type: GroupMessageType, content: string | File) => {
    try {
      setSendLoading(true)

      await onSend(type, content)

      setInputValue('')
      toast.success('Message sent successfully!')
    } catch {
    } finally {
      setSendLoading(false)
    }
  }

  useEffect(() => {
    inputRef.current?.focus()
  }, [sendLoading, inputValue])

  return (
    <div className="flex flex-shrink-0 items-end rounded-md m-4 p-2 bg-content2">
      <Textarea
        ref={inputRef}
        classNames={{
          inputWrapper: 'shadow-none'
        }}
        placeholder="input message here"
        maxRows={3}
        isDisabled={sendLoading}
        value={inputValue}
        onChange={e => {
          setInputValue(e.target.value)
        }}
        onKeyDown={e => {
          if (!e.shiftKey && e.key == 'Enter') {
            e.preventDefault()
            sendTextMsg()
          }
        }}
      />
      <div className="flex gap-1 ml-2">
        <ChatSelectFile
          onFileSelect={(file, type) => {
            if (type === SelectFileType.Image) {
              send(GroupMessageType.Image, file)
            } else if (type === SelectFileType.Video) {
              send(GroupMessageType.Video, file)
            }
          }}
        />
        <ChatEmoji
          onEmojiSelect={emoji => {
            setInputValue(prevValue => prevValue + emoji)
          }}
        />
        {sendLoading ? (
          <Loader2 className="animate-spin" />
        ) : (
          <SendHorizontal className="cursor-pointer" onClick={sendTextMsg} />
        )}
      </div>
    </div>
  )
}
