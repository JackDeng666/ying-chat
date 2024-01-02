import {
  IsEmail,
  IsNotEmpty,
  Length,
  Matches,
  MaxLength,
  MinLength
} from 'class-validator'

export class RegisterDto {
  @MinLength(6)
  @MaxLength(20)
  @IsNotEmpty()
  username: string

  @IsEmail()
  @IsNotEmpty()
  email: string

  @Matches(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*;',.])/, {
    message: `password must contain digits, lowercase letters, uppercase letters, and special symbols[!@#$%^&*;',.]`
  })
  @IsNotEmpty()
  password: string

  @Length(6)
  @IsNotEmpty()
  code: string
}
