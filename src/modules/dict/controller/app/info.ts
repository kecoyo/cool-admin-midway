import { Body, Get, Inject, Post, Provide } from '@midwayjs/core';
import {
  CoolController,
  BaseController,
  CoolUrlTag,
  TagTypes,
  CoolTag,
} from '@cool-midway/core';
import { DictInfoService } from '../../service/info';

/**
 * 字典信息
 */
@Provide()
@CoolController()
@CoolUrlTag()
export class AppDictInfoController extends BaseController {
  @Inject()
  dictInfoService: DictInfoService;

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Post('/data', { summary: '获得字典数据' })
  async data(@Body('types') types: string[] = []) {
    return this.ok(await this.dictInfoService.data(types));
  }

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Get('/types', { summary: '获得所有字典类型' })
  async types() {
    return this.ok(await this.dictInfoService.types());
  }
}
