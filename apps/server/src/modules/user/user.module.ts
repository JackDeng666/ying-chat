import { Module } from '@nestjs/common'
import { AuthController } from '@/modules/user/auth.controller'

@Module({
  controllers: [AuthController]
})
export class UserModule {}
