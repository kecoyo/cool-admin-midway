import { TianqinNoteEntity } from '../entity/note';
import { Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';

/**
 * 交易复盘速记
 */
@Provide()
export class TianqinNoteService extends BaseService {
  @InjectEntityModel(TianqinNoteEntity)
  tianqinNoteEntity: Repository<TianqinNoteEntity>;
}
