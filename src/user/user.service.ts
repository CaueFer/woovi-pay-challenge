import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '../lib/entity/user.entity';
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

  async getUserById(userId: string): Promise<User> {
    return this.userRepository.findOneOrFail({
      where: {
        id: userId,
      },
    });
  }

  async getUserByName(name: string): Promise<User> {
    return this.userRepository.findOneOrFail({
      where: {
        name: name,
      },
    });
  }

  async saveUser(newUser: CreateUserDto): Promise<User> {
    return await this.userRepository.save(newUser);
  }
}
