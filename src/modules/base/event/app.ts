import { CoolEvent, Event } from '@cool-midway/core';
import { App, ILogger, IMidwayApplication, Inject } from '@midwayjs/core';

/**
 * 接收事件
 */
@CoolEvent()
export class BaseAppEvent {
  @App()
  app: IMidwayApplication;

  @Inject()
  logger: ILogger;

  @Event('onServerReady')
  async onServerReady() {
    if (!process['pkg']) return;
    const port = this.app.getConfig('koa.port') || 8001;
    this.logger.info(`Server is running at http://127.0.0.1:${port}`);
    const url = `http://127.0.0.1:${port}`;

    // 使用 child_process 打开浏览器
    const { exec } = require('child_process');
    let command;

    switch (process.platform) {
      case 'darwin': // macOS
        command = `open ${url}`;
        break;
      case 'win32': // Windows
        command = `start ${url}`;
        break;
      default: // Linux
        command = `xdg-open ${url}`;
        break;
    }

    console.log('url=>', url);
    exec(command, (error: any) => {
      if (!error) {
        this.logger.info(`Application has opened in browser at ${url}`);
      }
    });
  }
}
