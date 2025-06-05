import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './user.entity';
import { CreateUserDto } from './dto/createUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async saveUser(newUser: CreateUserDto): Promise<string> {
    const user = await this.userRepository.save(newUser);
    return user.id;
  }
}
