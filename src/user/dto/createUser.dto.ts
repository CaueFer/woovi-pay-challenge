import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

@InputType()
export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Field()
  name: string;

  @IsNotEmpty()
  @Min(4)
  @IsNumber()
  @Field()
  pin: number;
}
