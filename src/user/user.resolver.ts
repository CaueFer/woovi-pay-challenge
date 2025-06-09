import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { UserService } from './user.service';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/createUser.dto';
import { SkipAuth } from 'src/lib/decorators/skipAuth.decorator';

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => [User])
  async users(): Promise<User[]> {
    return await this.userService.getAllUsers();
  }

  @Query(() => User)
  async findUser(@Args('id') id: string): Promise<User> {
    return await this.userService.getUserById(id);
  }

  @SkipAuth()
  @Mutation(() => String)
  async createUser(@Args('newUser') newUser: CreateUserDto): Promise<string> {
    return await this.userService.saveUser(newUser);
  }
}
