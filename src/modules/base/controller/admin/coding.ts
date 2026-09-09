import { CoolController, BaseController } from '@cool-midway/core';
import { Body, Get, Inject, Post } from '@midwayjs/core';
import { BaseCodingService } from '../../service/coding';

/**
 * Ai编码
 */
@CoolController()
export class AdminCodingController extends BaseController {
  @Inject()
  baseCodingService: BaseCodingService;

  @Get('/getModuleTree', { summary: '获取模块目录结构' })
  async getModuleTree() {
    return this.ok(await this.baseCodingService.getModuleTree());
  }

  @Post('/createCode', { summary: '创建代码' })
  async createCode(
    @Body('codes')
    codes: {
      path: string;
      content: string;
    }[]
  ) {
    this.baseCodingService.createCode(codes);
    return this.ok();
  }
}
