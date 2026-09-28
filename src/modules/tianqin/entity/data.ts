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

  @Column({ comment: '状态', dict: ['禁用', '启用'], default: 1 })
  status: number;

  @Column({ comment: '备注', length: 1000, nullable: true })
  remark: string;

  @Column({ comment: '主力合约代码', nullable: true })
  mainSymbol: string;

  @Column({ comment: '主力合约代码（不含交易所代码）', nullable: true })
  contractCode: string;

  @Column({ comment: '主力合约名称', nullable: true })
  contractName: string;

  @Column({
    comment: '当前价格',
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: true,
  })
  price: number;

  @Column({ comment: '趋势方向', nullable: true })
  dayTrendDirection: string;

  @Column({ comment: '当前状态', nullable: true })
  dayTrendState: string;

  @Column({ comment: 'KDJ信号', nullable: true })
  dayKdjSignal: string;

  @Column({
    comment: 'KDJ值',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  dayKdjValue: number;

  @Column({
    comment: 'CCI值',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  dayCciValue: number;

  @Column({ comment: '小时趋势方向', nullable: true })
  hourTrendDirection: string;

  @Column({
    comment: '小时CCI值',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  hourCciValue: number;

  @Column({ comment: '周线趋势方向', nullable: true })
  weekTrendDirection: string;

  @Column({ comment: '周线当前状态', nullable: true })
  weekTrendState: string;

  @Column({ comment: '周线KDJ信号', nullable: true })
  weekKdjSignal: string;

  @Column({
    comment: '周线KDJ值',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  weekKdjValue: number;

  @Column({ comment: '周线多空趋势', nullable: true })
  weekLongShortTrend: string;

  @Column({ comment: '周线多空状态', nullable: true })
  weekLongShortState: string;
}
