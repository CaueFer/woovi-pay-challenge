import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class SignInDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @Min(4)
  @IsNumber()
  pin: number;
}
