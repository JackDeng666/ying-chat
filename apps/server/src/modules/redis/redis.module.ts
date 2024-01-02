import { Global, Module } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { createClient } from 'redis'
import { redisConfig } from '@/config/redis.config'
import { RedisToken } from './constant'

@Global()
@Module({
  providers: [
    {
      provide: RedisToken,
      async useFactory(redisConf: ConfigType<typeof redisConfig>) {
        const client = createClient({
          socket: {
            host: redisConf.host,
            port: redisConf.port
          }
        })
        await client.connect()
        return client
      },
      inject: [redisConfig.KEY]
    }
  ],
  exports: [RedisToken]
})
export class RedisModule {}
