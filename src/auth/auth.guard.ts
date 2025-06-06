import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { IS_PUBLIC_KEY } from 'src/lib/decorators/skipAuth.decorator';
import { User } from 'src/lib/entity/user.entity';

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

      let request: Request;

      // HTTP - REST
      request = context.switchToHttp().getRequest<Request>();

      // SE NAO FOR REST
      if (!request) {
        const gqlCtx: { req: unknown } =
          GqlExecutionContext.create(context).getContext();

        if (!gqlCtx || !gqlCtx.req)
          throw new HttpException('Erro na requisição', 500);

        request = gqlCtx.req as Request;
      }

      const token = this.extractTokenFromHeader(request);
      if (!token) {
        throw new UnauthorizedException();
      }

      const payload: Partial<User> = await this.jwtService.verifyAsync(token, {
        secret: this.config.get<string>('JWT_SECRET'),
      });
      request['user'] = payload;
    } catch (err) {
      console.log('Erro auth guard: ', err);
      throw new HttpException('Erro no servidor.', 500);
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
