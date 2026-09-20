import { BaseEntity } from '../../base/entity/base';
import { Column, Entity } from 'typeorm';

/**
 * 天勤趋势分析
 */
@Entity('tianqin_trend')
export class TianqinTrendEntity extends BaseEntity {
  @Column({ comment: '品种代码', unique: true })
  code: string;

  @Column({ comment: '品种名称', unique: true })
  name: string;

  @Column({ comment: '备注', length: 1000, nullable: true })
  remark: string;

  @Column({ comment: '状态', dict: ['禁用', '启用'], default: 1 })
  status: number;

  @Column({ comment: '主力合约代码', nullable: true })
  mainSymbol: string;

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
  trendDirection: string;

  @Column({ comment: '当前状态', nullable: true })
  trendState: string;

  @Column({
    comment: '趋势强度',
    type: 'decimal',
    precision: 5,
    scale: 1,
    nullable: true,
  })
  trendStrength: number;

  @Column({ comment: '操作建议', nullable: true })
  action: string;

  @Column({ comment: '操作详情', nullable: true })
  actionDetail: string;
}
