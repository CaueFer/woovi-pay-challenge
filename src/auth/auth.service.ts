import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from 'src/user/user.service';
import { SignInDto } from './dto/signin.dto';
import { CreateUserDto } from 'src/user/dto/createUser.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(signInUser: SignInDto): Promise<string> {
    const { name, pin } = signInUser;
    const user = await this.userService.getUserByName(name);
    if (user?.pin !== pin) {
      throw new UnauthorizedException('Username not found.');
    }

    const userPayload = { id: user.id, name: user.name };

    const jwtToken = await this.jwtService.signAsync(userPayload);
    return jwtToken;
  }

  async signUp(signUpUser: CreateUserDto): Promise<{ message: string }> {
    const response = await this.userService.saveUser(signUpUser);

    return { message: response };
  }
}
