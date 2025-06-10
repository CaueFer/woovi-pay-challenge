import { Cache } from 'cache-manager';
import { hours } from '@nestjs/throttler';
import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

const REFILL_RATE_MS = hours(1); // milliseconds
const TOKEN_PER_HOUR = 1;
export const BUCKET_TOKEN_CAP = 10;

export interface TokenBucket {
  tokens: number;
  lastRefill: number;
}

@Injectable()
export class TokenBucketService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async getValue(key: string): Promise<TokenBucket | undefined> {
    return await this.cacheManager.get<TokenBucket>(key);
  }

  async setValue(vl: number, key: string) {
    const bucket: TokenBucket = {
      tokens: Number(vl),
      lastRefill: Date.now(),
    };
    await this.cacheManager.set(key, bucket);
  }

  refillUserTokens(tokens: number, lastRefill: number): number {
    const elapsed = Date.now() - lastRefill; // ms

    const hoursPassed = Math.floor(elapsed / REFILL_RATE_MS);

    const totalTokens = Math.min(
      BUCKET_TOKEN_CAP,
      tokens + hoursPassed * TOKEN_PER_HOUR,
    );

    return totalTokens;
  }

  async initBucket(key: string) {
    const bucket = { tokens: BUCKET_TOKEN_CAP, lastRefill: Date.now() };
    await this.cacheManager.set(key, bucket);
  }
}
