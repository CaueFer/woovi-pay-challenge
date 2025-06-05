import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Field()
  name: string;
}
