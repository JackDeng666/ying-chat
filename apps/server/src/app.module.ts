import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { apiConfig } from '@/config'
import { UserModule } from '@/modules/user/user.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [apiConfig]
    }),
    UserModule
  ]
})
export class AppModule {}
