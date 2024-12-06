import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class InvalidatedTokensService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async addToken(tokenId: string): Promise<void> {
    await this.redis.set(tokenId, 'invalidated', 'EX', 3600 * 24); // Expira em 24 horas
  }

  async isTokenInvalidated(tokenId: string): Promise<boolean> {
    const result = await this.redis.get(tokenId);
    return result === 'invalidated';
  }
}
