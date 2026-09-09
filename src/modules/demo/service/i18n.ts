import { Inject, Provide } from '@midwayjs/core';
import { BaseTranslateService } from '../../base/service/translate';

/**
 * 国际化服务
 */
@Provide()
export class DemoI18nService {
  @Inject()
  translate: BaseTranslateService;

  /**
   * 翻译成英文
   */
  async en() {
    const value = this.translate.comm('一个很Cool的框架')['en'];
    console.log(value);
    return value;
  }

  /**
   * 翻译成繁体
   */
  async tw() {
    const value = this.translate.comm('一个很Cool的框架')['zh-tw'];
    console.log(value);
    return value;
  }
}
