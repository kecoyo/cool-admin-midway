import { BaseEntity } from '../../base/entity/base';
import { Column, Entity } from 'typeorm';

/**
 * 交易复盘速记
 */
@Entity('tianqin_note')
export class TianqinNoteEntity extends BaseEntity {
  @Column({ comment: '品种名称', nullable: true })
  symbol: string;

  @Column({
    comment: '类型：signal信号/idea想法/quest疑问/review复盘/lesson教训',
    nullable: true,
  })
  tag: string;

  @Column({
    comment: '状态：watch待观察/ok已验证/no已否决',
    default: 'watch',
  })
  noteStatus: string;

  @Column({ comment: '内容', type: 'text', nullable: true })
  content: string;

  @Column({ comment: '日期（YYYY-MM-DD）', nullable: true })
  noteDate: string;

  @Column({ comment: '时间（HH:mm）', nullable: true })
  noteTime: string;
}
