import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const RedisOptions: CacheModuleAsyncOptions = {
  isGlobal: true,
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    stores: [
      // O PRIMEIRO VAI SER O DEFAULT (REDIS)
      createKeyv({
        password: config.get<string>('REDIS_PASSWORD'),

        socket: {
          host: config.get<string>('REDIS_HOST'),
          port: config.get<number>('REDIS_PORT'),
        },
      }),
    ],
  }),
};
