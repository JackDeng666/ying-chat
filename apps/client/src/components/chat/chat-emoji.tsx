import React from 'react'
import { Popover, PopoverTrigger, PopoverContent } from '@nextui-org/react'
import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data'
import { Smile } from 'lucide-react'
import { useTheme } from '../theme-provider'

type ChatEmojiProps = {
  onEmojiSelect?: (emoji: string) => void
}

export const ChatEmoji: React.FC<ChatEmojiProps> = ({ onEmojiSelect }) => {
  const { theme } = useTheme()

  return (
    <Popover placement="top" backdrop="opaque">
      <PopoverTrigger>
        <Smile className="cursor-pointer" />
      </PopoverTrigger>
      <PopoverContent className="bg-transparent shadow-none">
        <Picker
          theme={theme}
          data={data}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onEmojiSelect={(emoji: any) => {
            onEmojiSelect && onEmojiSelect(emoji.native)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
