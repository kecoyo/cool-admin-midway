import { CoolEvent, CoolEventManager, Event } from '@cool-midway/core';
import { BaseSysMenuService } from '../service/sys/menu';
import {
  App,
  ILogger,
  IMidwayApplication,
  Inject,
  Logger,
} from '@midwayjs/core';
import { BaseTranslateService } from '../service/translate';

/**
 * 导入菜单
 */
@CoolEvent()
export class BaseMenuEvent {
  @Logger()
  coreLogger: ILogger;

  @Inject()
  baseSysMenuService: BaseSysMenuService;

  @App()
  app: IMidwayApplication;

  @Inject()
  coolEventManager: CoolEventManager;

  @Inject()
  baseTranslateService: BaseTranslateService;

  @Event('onMenuImport')
  async onMenuImport(datas) {
    for (const module in datas) {
      await this.baseSysMenuService.import(datas[module]);
      this.coreLogger.info(
        '\x1B[36m [cool:module:base] midwayjs cool module base import [' +
          module +
          '] module menu success \x1B[0m'
      );
    }
    this.coolEventManager.emit('onMenuInit', {});
    this.baseTranslateService.check();
  }

  @Event('onServerReady')
  async onServerReady() {
    this.baseTranslateService.loadTranslations();
  }
}
