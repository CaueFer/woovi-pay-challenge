import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class SavePixKeyDto {
  @IsString()
  @IsNotEmpty()
  @Field()
  key: string;
}
