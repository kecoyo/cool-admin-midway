import { BaseEntity } from '../base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 部门
 */
@Entity('base_sys_department')
export class BaseSysDepartmentEntity extends BaseEntity {
  @Column({ comment: '部门名称' })
  name: string;

  @Index()
  @Column({ comment: '创建者ID', nullable: true })
  userId: number;

  @Column({ comment: '上级部门ID', nullable: true })
  parentId: number;

  @Column({ comment: '排序', default: 0 })
  orderNum: number;
  // 父菜单名称
  parentName: string;
}
