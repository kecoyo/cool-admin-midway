import { CoolController, BaseController } from '@cool-midway/core';
import { DemoI18nService } from '../../service/i18n';

/**
 * 国际化
 */
@CoolController({
  serviceApis: [
    {
      method: 'en',
      summary: '翻译成英文',
    },
    {
      method: 'tw',
      summary: '翻译成繁体',
    },
  ],
  service: DemoI18nService,
})
export class DemoI18nController extends BaseController {}
