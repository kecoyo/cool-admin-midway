import { TianqinTypeEntity } from '../../entity/type';
import { Provide } from '@midwayjs/core';
import { CoolController, BaseController } from '@cool-midway/core';
import { TianqinTypeService } from '../../service/type';

/**
 * 天勤期货品种
 */
@Provide()
@CoolController({
  api: ['add', 'update', 'info', 'list', 'page'],
  entity: TianqinTypeEntity,
  service: TianqinTypeService,
  pageQueryOp: {
    keyWordLikeFields: ['code', 'name'],
    fieldEq: ['status'],
  },
})
export class AdminTianqinTypeController extends BaseController {}
