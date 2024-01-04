import { IsNotEmpty, IsOptional } from 'class-validator'

export class GroupMessageListDto {
  @IsNotEmpty()
  groupId: number

  @IsOptional()
  cursorId?: number

  @IsOptional()
  size?: number
}
