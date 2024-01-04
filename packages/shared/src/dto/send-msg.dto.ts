import { IsNotEmpty, MaxLength } from 'class-validator'

export class SendMsgDto {
  @IsNotEmpty()
  groupId: number

  @MaxLength(5000)
  @IsNotEmpty()
  content: string
}
