import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { UserService } from './user.service';
import { User } from '../lib/entity/user.entity';
import { CreateUserDto } from './dto/createUser.dto';

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

  @Mutation(() => User)
  async createUser(@Args('newUser') newUser: CreateUserDto): Promise<User> {
    return await this.userService.saveUser(newUser);
  }
}
