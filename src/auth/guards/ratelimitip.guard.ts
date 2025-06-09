/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ThrottlerGuard } from '@nestjs/throttler';
import { type Request, type Response } from 'express';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ExecutionContext, Injectable } from '@nestjs/common';

interface getContext {
  req: Request;
  res: Response;
}

@Injectable()
export class RateLimitByIp extends ThrottlerGuard {
  getRequestResponse(context: ExecutionContext): {
    req: Record<string, any>;
    res: Record<string, any>;
  } {
    const ctxType = context.getType<'http' | 'ws' | 'graphql'>();

    if (ctxType === 'http') {
      const req = context.switchToHttp().getRequest();
      const res = context.switchToHttp().getResponse();
      return { req, res };
    }

    if (ctxType === 'graphql') {
      const gqlCtx = GqlExecutionContext.create(context);
      const ctx = gqlCtx.getContext<getContext>();
      return { req: ctx.req, res: ctx.res };
    }

    return { req: {}, res: {} };
  }

  protected getTracker(req: Record<string, any>): Promise<string> {
    const ip: unknown =
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      req.ip || req?.headers?.['x-forwarded-for'] || 'unknown';

    return ip as Promise<string>; // LIMITA APENAS POR IP
  }
}
