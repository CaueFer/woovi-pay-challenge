import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { CreateUserDto } from 'src/user/dto/createUser.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signin')
  async signIn(@Body() user: SignInDto): Promise<{ token: string }> {
    const token = await this.authService.signIn(user);
    return { token };
  }

  @Post('/signup')
  async signup(@Body() newUser: CreateUserDto): Promise<{ message: string }> {
    return await this.authService.signUp(newUser);
  }
}
