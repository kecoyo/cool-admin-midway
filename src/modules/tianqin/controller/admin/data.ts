import { TianqinDataEntity } from '../../entity/data';
import { Get, Inject, Provide } from '@midwayjs/core';
import { CoolController, BaseController } from '@cool-midway/core';
import { TianqinDataService } from '../../service/data';

/**
 * 天勤数据分析
 */
@Provide()
@CoolController({
  api: ['page'],
  entity: TianqinDataEntity,
  service: TianqinDataService,
  pageQueryOp: {
    fieldEq: ['createTime', 'trend', 'band'],
    keyWordLikeFields: ['code', 'name'],
    addOrderBy: {
      hourCciValue: 'DESC',
    },
  },
})
export class AdminTianqinDataController extends BaseController {
  @Inject()
  tianqinDataService: TianqinDataService;

  /**
   * 获取所有去重的时间列表（降序）
   */
  @Get('/times', { summary: '时间列表' })
  async times() {
    const result = await this.tianqinDataService.tianqinDataEntity
      .createQueryBuilder('e')
      .select('DISTINCT e.createTime', 'createTime')
      .orderBy('e.createTime', 'DESC')
      .limit(20)
      .getRawMany();
    return this.ok(result.map(item => item.createTime));
  }
}
