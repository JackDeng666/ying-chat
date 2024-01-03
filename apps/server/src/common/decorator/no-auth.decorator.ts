import { SetMetadata } from '@nestjs/common'

export const NOT_REQUIRED_AUTH = 'notRequiredAuth'

export const NotRequiredAuth = () => SetMetadata(NOT_REQUIRED_AUTH, true)
