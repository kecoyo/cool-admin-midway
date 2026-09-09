import { TianqinDataEntity } from '../../entity/data';
import { Inject, Provide } from '@midwayjs/core';
import { CoolController, BaseController } from '@cool-midway/core';
import { TianqinDataService } from '../../service/data';

/**
 * 天勤数据分析
 */
@Provide()
@CoolController({
  api: ['page', 'info', 'update'],
  entity: TianqinDataEntity,
  service: TianqinDataService,
  pageQueryOp: {
    fieldEq: ['trend', 'band', 'status'],
    keyWordLikeFields: ['code', 'name', 'mainSymbol'],
    addOrderBy: {
      hourCciValue: 'DESC',
    },
  },
})
export class AdminTianqinDataController extends BaseController {
  @Inject()
  tianqinDataService: TianqinDataService;
}
