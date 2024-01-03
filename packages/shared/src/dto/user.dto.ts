import { IsOptional, MaxLength, MinLength } from 'class-validator'

export class UpdateUserDto {
  @MinLength(6)
  @MaxLength(20)
  @IsOptional()
  username?: string

  @MinLength(2)
  @MaxLength(20)
  @IsOptional()
  nickname?: string
}
