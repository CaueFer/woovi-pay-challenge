import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { UserService } from './user.service';
import { User } from './user.entity';
import { CreateUserDto } from './dto/createUser.dto';

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => [User])
  async users(): Promise<User[]> {
    return await this.userService.getAllUsers();
  }

  @Mutation(() => User)
  async createUser(@Args('newUser') newUser: CreateUserDto): Promise<User> {
    return await this.userService.saveUser(newUser);
  }
}
