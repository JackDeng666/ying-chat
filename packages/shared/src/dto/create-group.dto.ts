import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  MaxLength,
  MinLength
} from 'class-validator'

export class CreateGroupDto {
  @MinLength(2)
  @MaxLength(32)
  @IsNotEmpty()
  name: string

  @IsNumber()
  @IsNotEmpty()
  coverId: number

  @MinLength(2)
  @MaxLength(100)
  @IsOptional()
  description?: string
}
