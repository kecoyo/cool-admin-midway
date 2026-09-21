import { TianqinDataEntity } from '../../entity/data';
import { Inject, Post, Provide } from '@midwayjs/core';
import { CoolController, BaseController } from '@cool-midway/core';
import { TianqinDataService } from '../../service/data';
import axios from 'axios';

/**
 * 天勤数据分析
 */
@Provide()
@CoolController({
  api: ['update', 'info', 'list', 'page'],
  entity: TianqinDataEntity,
  service: TianqinDataService,
  pageQueryOp: {
    fieldEq: ['trend', 'band', 'status'],
    keyWordLikeFields: ['code', 'name', 'mainSymbol'],
  },
})
export class AdminTianqinDataController extends BaseController {
  @Inject()
  tianqinDataService: TianqinDataService;

  /**
   * 启动数据分析任务
   * 转发请求到 http://192.168.0.191:8002/api/macd_kdj
   */
  @Post('/startTask', { summary: '启动任务' })
  async startTask() {
    const res = await axios.post('http://192.168.0.191:8002/api/macd_kdj', {});
    return res.data;
  }
}
