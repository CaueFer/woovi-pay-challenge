import { join } from 'node:path';

import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloDriver, type ApolloDriverConfig } from '@nestjs/apollo';

import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';
import { typeOrmConfig } from './config/db.config';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
