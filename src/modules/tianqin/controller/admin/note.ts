import { TianqinNoteEntity } from '../../entity/note';
import { Body, Get, Inject, Post, Provide } from '@midwayjs/core';
import { CoolController, BaseController } from '@cool-midway/core';
import { TianqinNoteService } from '../../service/note';
import { Context } from '@midwayjs/koa';

/**
 * 交易复盘速记
 */
@Provide()
@CoolController({
  api: ['add', 'update', 'info', 'list', 'page', 'delete'],
  entity: TianqinNoteEntity,
  service: TianqinNoteService,
  pageQueryOp: {
    fieldEq: ['symbol', 'tag', 'noteStatus', 'noteDate'],
    keyWordLikeFields: ['content'],
    addOrderBy: {
      noteDate: 'DESC',
      noteTime: 'DESC',
    },
  },
})
export class AdminTianqinNoteController extends BaseController {
  @Inject()
  tianqinNoteService: TianqinNoteService;

  @Inject()
  ctx: Context;
}
