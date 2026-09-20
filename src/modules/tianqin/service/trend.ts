import { TianqinTrendEntity } from '../entity/trend';
import { Config, Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository, In } from 'typeorm';
import * as _ from 'lodash';

/**
 * 天勤趋势分析
 */
@Provide()
export class TianqinTrendService extends BaseService {
  @InjectEntityModel(TianqinTrendEntity)
  tianqinTrendEntity: Repository<TianqinTrendEntity>;
}
