import { BaseEntity } from '../../base/entity/base';
import { Column, Entity } from 'typeorm';

/**
 * 天勤期货品种
 */
@Entity('tianqin_type')
export class TianqinTypeEntity extends BaseEntity {
  @Column({ comment: '代码', unique: true, nullable: true })
  code: string;

  @Column({ comment: '名称', unique: true, nullable: true })
  name: string;

  @Column({ comment: '备注' })
  remark: string;

  @Column({ comment: '状态', dict: ['禁用', '正常'], default: 1 })
  status: number;
}
