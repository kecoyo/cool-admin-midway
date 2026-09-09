import { Inject, Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { DemoGoodsEntity } from '../entity/goods';
import { noTenant } from '../../base/db/tenant';

/**
 * 商品服务
 */
@Provide()
export class DemoTenantService extends BaseService {
  @InjectEntityModel(DemoGoodsEntity)
  demoGoodsEntity: Repository<DemoGoodsEntity>;

  @Inject()
  ctx;

  /**
   * 使用多租户
   */
  async use() {
    await this.demoGoodsEntity.createQueryBuilder().getMany();
    await this.demoGoodsEntity.find();
  }

  /**
   * 不使用多租户(局部不使用)
   */
  async noUse() {
    // 过滤多租户
    await this.demoGoodsEntity.createQueryBuilder().getMany();
    // 被noTenant包裹，不会过滤多租户
    await noTenant(this.ctx, async () => {
      return await this.demoGoodsEntity.createQueryBuilder().getMany();
    });
    // 过滤多租户
    await this.demoGoodsEntity.find();
  }

  /**
   * 无效多租户
   */
  async invalid() {
    // 自定义sql，不进行多租户过滤
    await this.nativeQuery('select * from demo_goods');
    // 自定义分页sql，不进行多租户过滤
    await this.sqlRenderPage('select * from demo_goods');
  }
}
