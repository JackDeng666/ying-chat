import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtModule } from '@nestjs/jwt'
import { UserEntity } from '@/modules/db/entities'
import { AuthController } from '@/modules/user/auth.controller'
import { AuthService } from './auth.service'
import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), JwtModule.register({})],
  controllers: [AuthController, UserController],
  providers: [AuthService, UserService],
  exports: [AuthService]
})
export class UserModule {}
