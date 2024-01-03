import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { apiConfig, dbConfig, emailConfig, redisConfig } from '@/config'
import { DbModule } from '@/modules/db/db.module'
import { RedisModule } from '@/modules/redis/redis.module'
import { UserModule } from '@/modules/user/user.module'
import { EmailModule } from '@/modules/email/email.module'
import { AuthGuard } from '@/common/guard'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [apiConfig, dbConfig, redisConfig, emailConfig]
    }),
    DbModule,
    RedisModule,
    EmailModule,
    UserModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    }
  ]
})
export class AppModule {}
