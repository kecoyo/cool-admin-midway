import { Body, Get, Inject, Post, Provide } from '@midwayjs/core';
import {
  CoolController,
  BaseController,
  CoolUrlTag,
  TagTypes,
  CoolTag,
} from '@cool-midway/core';
import { TianqinDataService } from '../../service/data';

/**
 * 天勤数据分析
 */
@Provide()
@CoolController()
@CoolUrlTag()
export class AppTianqinDataController extends BaseController {
  @Inject()
  tianqinDataService: TianqinDataService;
}
