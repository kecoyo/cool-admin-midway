import { TianqinDataEntity } from '../entity/data';
import { Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository, In } from 'typeorm';

/**
 * 天勤期货品种
 */
@Provide()
export class TianqinTypeService extends BaseService {
  @InjectEntityModel(TianqinDataEntity)
  tianqinDataEntity: Repository<TianqinDataEntity>;
}
