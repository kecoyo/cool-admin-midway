import { DemoCacheService } from '../../service/cache';
import { Inject, Post, Provide, Get, InjectClient } from '@midwayjs/core';
import { CoolController, BaseController } from '@cool-midway/core';
import { CachingFactory, MidwayCache } from '@midwayjs/cache-manager';

/**
 * 缓存
 */
@CoolController()
export class OpenDemoCacheController extends BaseController {
  @InjectClient(CachingFactory, 'default')
  midwayCache: MidwayCache;

  @Inject()
  demoCacheService: DemoCacheService;

  /**
   * 设置缓存
   * @returns
   */
  @Post('/set', { summary: '设置缓存' })
  async set() {
    await this.midwayCache.set('a', 1);
    // 缓存10秒
    await this.midwayCache.set('a', 1, 10 * 1000);
    return this.ok(await this.midwayCache.get('a'));
  }

  /**
   * 获得缓存
   * @returns
   */
  @Get('/get', { summary: '获得缓存' })
  async get() {
    return this.ok(await this.demoCacheService.get());
  }
}
