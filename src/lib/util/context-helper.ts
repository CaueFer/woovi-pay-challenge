import { type Request } from 'express';
import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { RequestWithUser } from '../globalType';

export class contextHelper {
  static getRequestFromCtx(context: ExecutionContext): RequestWithUser | null {
    const ctxType = context.getType<'http' | 'ws' | 'graphql'>();

    let request: Request | null = null;
    if (ctxType === 'http')
      request = context.switchToHttp().getRequest<Request>();

    if (ctxType === 'graphql') {
      const gqlCtx: { req: Request } =
        GqlExecutionContext?.create(context).getContext();
      request = gqlCtx.req;
    }

    return request;
  }
}
