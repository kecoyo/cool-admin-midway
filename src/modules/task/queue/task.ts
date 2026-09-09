import { App, Inject } from '@midwayjs/core';
import { BaseCoolQueue, CoolQueue } from '@cool-midway/task';
import { TaskBullService } from '../service/bull';
import { IMidwayApplication } from '@midwayjs/core';

/**
 * 任务
 */
@CoolQueue()
export abstract class TaskInfoQueue extends BaseCoolQueue {
  @App()
  app: IMidwayApplication;

  @Inject()
  taskBullService: TaskBullService;

  async data(job, done: any): Promise<void> {
    try {
      const result = await this.taskBullService.invokeService(job.data.service);
      this.taskBullService.record(job.data, 1, JSON.stringify(result));
    } catch (error) {
      this.taskBullService.record(job.data, 0, error.message);
    }
    if (!job.data.isOnce) {
      this.taskBullService.updateNextRunTime(job.data.jobId);
      this.taskBullService.updateStatus(job.data.id);
    }
    done();
  }
}
