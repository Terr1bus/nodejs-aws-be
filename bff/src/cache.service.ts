import { Injectable } from '@nestjs/common';

const cacheTimeSeconds = 120;

@Injectable()
export class CacheService {
  private lastCachedTime: number | null = null;
  private cachedRespone: Record<string, unknown> | null = null;

  public getCache(): Record<string, unknown> | null {
    if (this.isCacheOutdated()) {
      this.cachedRespone = null;
    }
    console.log('Returning response from cache');
    console.log(
      'Cache was updated at',
      new Date(this.lastCachedTime!).toLocaleTimeString(),
    );
    console.log(
      'Seconds to invalidate cache:',
      (cacheTimeSeconds * 1000 - (Date.now() - this.lastCachedTime!)) / 1000,
    );
    return this.cachedRespone;
  }

  public setCache(data: Record<string, unknown>): void {
    this.cachedRespone = data;
    this.lastCachedTime = Date.now();
    console.log('Cache was updated at', new Date().toLocaleTimeString());
  }

  public isEmpty(): boolean {
    return this.cachedRespone === null || this.isCacheOutdated();
  }

  private isCacheOutdated(): boolean {
    return (
      this.lastCachedTime === null ||
      this.lastCachedTime + cacheTimeSeconds * 1000 < Date.now()
    );
  }
}
