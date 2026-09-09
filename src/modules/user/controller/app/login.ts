import {
  CoolController,
  BaseController,
  CoolUrlTag,
  TagTypes,
  CoolTag,
} from '@cool-midway/core';
import { Body, Get, Inject, Post, Query } from '@midwayjs/core';
import { UserLoginService } from '../../service/login';
import { BaseSysLoginService } from '../../../base/service/sys/login';

/**
 * 登录
 */
@CoolUrlTag()
@CoolController()
export class AppUserLoginController extends BaseController {
  @Inject()
  userLoginService: UserLoginService;

  @Inject()
  baseSysLoginService: BaseSysLoginService;

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Post('/mini', { summary: '小程序登录' })
  async mini(@Body() body) {
    const { code, encryptedData, iv } = body;
    return this.ok(await this.userLoginService.mini(code, encryptedData, iv));
  }

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Post('/mp', { summary: '公众号登录' })
  async mp(@Body('code') code: string) {
    return this.ok(await this.userLoginService.mp(code));
  }

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Post('/wxApp', { summary: '微信APP授权登录' })
  async app(@Body('code') code: string) {
    return this.ok(await this.userLoginService.wxApp(code));
  }

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Post('/phone', { summary: '手机号登录' })
  async phone(@Body('phone') phone: string, @Body('smsCode') smsCode: string) {
    return this.ok(await this.userLoginService.phoneVerifyCode(phone, smsCode));
  }

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Post('/uniPhone', { summary: '一键手机号登录' })
  async uniPhone(
    @Body('access_token') access_token: string,
    @Body('openid') openid: string,
    @Body('appId') appId: string
  ) {
    return this.ok(
      await this.userLoginService.uniPhone(access_token, openid, appId)
    );
  }

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Post('/miniPhone', { summary: '绑定小程序手机号' })
  async miniPhone(@Body() body) {
    const { code, encryptedData, iv } = body;
    return this.ok(
      await this.userLoginService.miniPhone(code, encryptedData, iv)
    );
  }

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Get('/captcha', { summary: '图片验证码' })
  async captcha(
    @Query('width') width: number,
    @Query('height') height: number,
    @Query('color') color: string
  ) {
    return this.ok(
      await this.baseSysLoginService.captcha(width, height, color)
    );
  }

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Post('/smsCode', { summary: '验证码' })
  async smsCode(
    @Body('phone') phone: string,
    @Body('captchaId') captchaId: string,
    @Body('code') code: string
  ) {
    return this.ok(await this.userLoginService.smsCode(phone, captchaId, code));
  }

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Post('/refreshToken', { summary: '刷新token' })
  public async refreshToken(@Body('refreshToken') refreshToken) {
    return this.ok(await this.userLoginService.refreshToken(refreshToken));
  }

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Post('/password', { summary: '密码登录' })
  async password(
    @Body('phone') phone: string,
    @Body('password') password: string
  ) {
    return this.ok(await this.userLoginService.password(phone, password));
  }
}
