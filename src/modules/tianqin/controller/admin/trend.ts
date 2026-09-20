import { TianqinTrendEntity } from '../../entity/trend';
import { Inject, Provide } from '@midwayjs/core';
import { CoolController, BaseController } from '@cool-midway/core';
import { TianqinTrendService } from '../../service/trend';

/**
 * 天勤趋势分析
 */
@Provide()
@CoolController({
  api: ['update', 'info', 'list', 'page'],
  entity: TianqinTrendEntity,
  service: TianqinTrendService,
  pageQueryOp: {
    fieldEq: ['trendDirection', 'trendState', 'status'],
    keyWordLikeFields: [
      'code',
      'name',
      'remark',
      'mainSymbol',
      'action',
      'actionDetail',
    ],
  },
})
export class AdminTianqinTrendController extends BaseController {
  @Inject()
  tianqinTrendService: TianqinTrendService;
}
