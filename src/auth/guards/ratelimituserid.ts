import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { createHash } from 'node:crypto';

import {
  BUCKET_TOKEN_CAP,
  TokenBucketService,
} from 'src/lib/services/token_bucket.service';
import { contextHelper } from 'src/lib/util/context-helper';

@Injectable()
export class RateLimitByUserId implements CanActivate {
  constructor(private tokenBucketService: TokenBucketService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = contextHelper.getRequestFromCtx(context);
    if (!request)
      throw new UnauthorizedException({
        message: 'Invalid request type.',
      });

    const { user } = request;
    if (!user || !user?.id) {
      throw new UnauthorizedException({
        message: 'User not authenticated',
      });
    }

    const { id } = user;

    // TOKEN BUCKET
    const bucketKey = createHash('sha256').update(id).digest('hex');
    let userBucket = await this.tokenBucketService.getValue(bucketKey);
    console.log(userBucket);

    // SE NAO TIVER - INICIALIZA BUCKET
    if (userBucket == null) {
      await this.tokenBucketService.initBucket(bucketKey);
      userBucket = { tokens: BUCKET_TOKEN_CAP, lastRefill: Date.now() };
    }

    // REFILL DOS TOKENS
    const updatedTokens = (userBucket.tokens =
      this.tokenBucketService.refillUserTokens(
        userBucket.tokens,
        userBucket.lastRefill,
      ));

    if (updatedTokens < 1) {
      throw new HttpException(
        "Too Many Requests. You don't have enough tokens",
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    await this.tokenBucketService.setValue(updatedTokens - 1, bucketKey);
    return true;
  }
}
