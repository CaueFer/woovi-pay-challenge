import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { type Request } from 'express';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { IS_PUBLIC_KEY } from 'src/lib/decorators/skipAuth.decorator';
import { contextHelper } from 'src/lib/util/context-helper';

import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private config: ConfigService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const isPublic = this.reflector.getAllAndOverride<boolean>(
        IS_PUBLIC_KEY,
        [context.getHandler(), context.getClass()],
      );
      if (isPublic) return true;

      const request = contextHelper.getRequestFromCtx(context);

      if (!request)
        throw new UnauthorizedException({
          message: 'Invalid request type.',
        });

      const token = this.extractTokenFromHeader(request);
      if (!token) {
        throw new UnauthorizedException({
          message: 'Unauthorized, please give your JWT Token.',
        });
      }

      const payload: Partial<User> = await this.jwtService.verifyAsync(token, {
        secret: this.config.get<string>('JWT_SECRET'),
      });
      request['user'] = payload;
    } catch (err) {
      console.log('Erro auth guard: ', err);
      throw err;
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
