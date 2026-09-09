import { BaseEntity } from '../../base/entity/base';
import { Column, Entity } from 'typeorm';

/**
 * 天勤行情分析
 */
@Entity('tianqin_data')
export class TianqinDataEntity extends BaseEntity {
  @Column({ comment: '品种代码', unique: true })
  code: string;

  @Column({ comment: '品种名称', unique: true })
  name: string;

  @Column({ comment: '备注', length: 1000, nullable: true })
  remark: string;

  @Column({ comment: '状态', dict: ['禁用', '启用'], default: 1 })
  status: number;

  @Column({ comment: '主力合约', nullable: true })
  mainSymbol: string;

  @Column({
    comment: '当前价格',
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: true,
  })
  price: number;

  @Column({ comment: '趋势方向', nullable: true })
  trend: string;

  @Column({ comment: '当前运行', nullable: true })
  band: string;

  @Column({ comment: 'KDJ信号', nullable: true })
  kdjSignal: string;

  @Column({
    comment: 'KDJ值',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  kdjValue: number;

  @Column({
    comment: 'CCI值',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  cciValue: number;

  @Column({ comment: '小时趋势方向', nullable: true })
  hourTrend: string;

  @Column({
    comment: '小时CCI值',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  hourCciValue: number;
}
