import { TianqinTypeEntity } from '../entity/type';
import { TianqinDataEntity } from '../entity/data';
import { Config, Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository, In } from 'typeorm';
import * as _ from 'lodash';

/**
 * 天勤数据分析
 */
@Provide()
export class TianqinDataService extends BaseService {
  @InjectEntityModel(TianqinDataEntity)
  tianqinDataEntity: Repository<TianqinDataEntity>;

  @InjectEntityModel(TianqinTypeEntity)
  tianqinTypeEntity: Repository<TianqinTypeEntity>;
}
