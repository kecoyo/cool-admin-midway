import { DictInfoEntity } from './../entity/info';
import { Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository, In } from 'typeorm';

/**
 * 描述
 */
@Provide()
export class DictTypeService extends BaseService {
  @InjectEntityModel(DictInfoEntity)
  dictInfoEntity: Repository<DictInfoEntity>;

  /**
   * 删除
   * @param ids
   */
  async delete(ids) {
    await super.delete(ids);
    await this.dictInfoEntity.delete({
      typeId: In(ids),
    });
  }
}
