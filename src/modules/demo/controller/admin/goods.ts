import { CoolController, BaseController } from '@cool-midway/core';
import { DemoGoodsEntity } from '../../entity/goods';
import { UserInfoEntity } from '../../../user/entity/info';
import { DemoGoodsService } from '../../service/goods';

/**
 * 商品模块-商品信息
 */
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: DemoGoodsEntity,
  service: DemoGoodsService,
  pageQueryOp: {
    keyWordLikeFields: ['a.description'],
    fieldEq: ['a.status'],
    fieldLike: ['a.title'],
    select: ['a.*', 'b.nickName as userName'],
    join: [
      {
        entity: UserInfoEntity,
        alias: 'b',
        condition: 'a.id = b.id',
      },
    ],
  },
})
export class AdminDemoGoodsController extends BaseController {}
