import { Field, ObjectType } from '@nestjs/graphql';

import { PixKey } from './pix_key.entity';

@ObjectType()
export class PixKeyResponse {
  @Field({ nullable: true })
  message?: string;

  @Field(() => PixKey, { nullable: true })
  pixKey?: string;
}
