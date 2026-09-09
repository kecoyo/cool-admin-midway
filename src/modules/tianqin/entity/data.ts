import { BaseEntity } from '../../base/entity/base';
import { Column, Entity } from 'typeorm';

/**
 * 天勤数据分析
 */
@Entity('tianqin_data')
export class TianqinDataEntity extends BaseEntity {
  @Column({ comment: '合约代码' })
  code: string;

  @Column({ comment: '合约名称' })
  name: string;

  @Column({ comment: '当前价格', type: 'decimal', precision: 12, scale: 2 })
  price: number;

  @Column({ comment: '趋势方向' })
  trend: string;

  @Column({ comment: '当前运行' })
  band: string;

  @Column({ comment: 'KDJ信号' })
  kdjSignal: string;

  @Column({ comment: 'KDJ值', type: 'decimal', precision: 10, scale: 2 })
  kdjValue: number;

  @Column({ comment: 'CCI值', type: 'decimal', precision: 10, scale: 2 })
  cciValue: number;

  @Column({ comment: '小时趋势方向' })
  hourTrend: string;

  @Column({ comment: '小时CCI值', type: 'decimal', precision: 10, scale: 2 })
  hourCciValue: number;
}
