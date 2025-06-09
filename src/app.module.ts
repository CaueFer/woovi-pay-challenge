import { join } from 'node:path';

import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ThrottlerModule } from '@nestjs/throttler';
import { type Request, type Response } from 'express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApolloDriver, type ApolloDriverConfig } from '@nestjs/apollo';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';

import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/guards/auth.guard';
import { PaymentModule } from './payment/payment.module';
import { RateLimitByIp } from './auth/guards/ratelimitip.guard';

import { typeOrmConfig } from './config/db.config';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisOptions } from './config/redis.config';
@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      context: ({ req, res }: { req: Request; res: Response }) => ({
        req,
        res,
      }),
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            ttl: Number(config.get('THROTTLE_TTL') ?? 60 * 1000),
            limit: Number(config.get('THROTTLE_LIMIT') ?? 10),
          },
        ],
        storage: new ThrottlerStorageRedisService(
          config.get<string>('REDIS_URL'),
        ),
      }),
    }),
    CacheModule.registerAsync(RedisOptions),
    UserModule,
    AuthModule,
    PaymentModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RateLimitByIp,
    },
  ],
})
export class AppModule {}
