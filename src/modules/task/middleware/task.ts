import { CoolCommException } from '@cool-midway/core';
import { Inject, Middleware } from '@midwayjs/core';
import { NextFunction, Context } from '@midwayjs/koa';
import { IMiddleware } from '@midwayjs/core';
import { TaskInfoQueue } from '../queue/task';
import { TaskInfoService } from '../service/info';

/**
 * 任务中间件
 */
@Middleware()
export class TaskMiddleware implements IMiddleware<Context, NextFunction> {
  @Inject()
  taskInfoQueue: TaskInfoQueue;

  @Inject()
  taskInfoService: TaskInfoService;

  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      const urls = ctx.url.split('/');
      const type = await this.taskInfoService.initType();
      if (
        ['add', 'update', 'once', 'stop', 'start'].includes(
          urls[urls.length - 1]
        ) &&
        type == 'bull'
      ) {
        if (!this.taskInfoQueue.metaQueue) {
          throw new CoolCommException(
            'task插件未启用或redis配置错误或redis版本过低(>=6.x)'
          );
        }
      }
      await next();
    };
  }
}
