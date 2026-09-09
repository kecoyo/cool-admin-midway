import { BaseEntity, transformerJson } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 商品模块-商品信息
 */
@Entity('demo_goods')
export class DemoGoodsEntity extends BaseEntity {
  @Index()
  @Column({ comment: '标题', length: 50 })
  title: string;

  @Column({
    comment: '价格',
    type: 'decimal',
    precision: 5,
    scale: 2,
  })
  price: number;

  @Column({ comment: '描述', nullable: true })
  description: string;

  @Column({ comment: '主图', nullable: true })
  mainImage: string;

  @Column({ comment: '分类', dict: 'goodsType' })
  type: number;

  @Column({ comment: '状态', dict: ['禁用', '启用'], default: 1 })
  status: number;

  @Column({
    comment: '示例图',
    nullable: true,
    type: 'json',
    transformer: transformerJson,
  })
  exampleImages: string[];

  @Column({ comment: '库存', default: 0 })
  stock: number;
}
