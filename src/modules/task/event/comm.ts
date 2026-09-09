import { Inject } from '@midwayjs/core';
import { CoolEvent, Event } from '@cool-midway/core';
import { TaskInfoService } from '../service/info';
import { TaskLocalService } from '../service/local';

/**
 * 应用事件
 */
@CoolEvent()
export class TaskCommEvent {
  @Inject()
  taskInfoService: TaskInfoService;

  @Inject()
  taskLocalService: TaskLocalService;

  @Event('onServerReadyOnce')
  async onServerReady() {
    this.taskInfoService.initTask();
  }

  @Event()
  async onLocalTaskStop(jobId) {
    this.taskLocalService.stopByJobId(jobId);
  }
}
