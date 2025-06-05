import { Query, Resolver } from '@nestjs/graphql';

import { UserService } from './user.service';
import { User } from './user.entity';

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => [User])
  async users(): Promise<User[]> {
    return await this.userService.getAllUsers();
  }
}
