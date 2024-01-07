import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Warehouse } from '../warehouses/warehouse.entity';
import { Product } from '../products/product.entity';

@Entity('inventories')
export class Inventory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  quantity: number;

  @OneToOne(() => Product, (product) => product.inventory, {
    cascade: ['insert', 'update'],
  })
  product: Product;

  @OneToMany(() => Warehouse, (warehouse) => warehouse.inventory, {
    cascade: ['insert', 'update'],
  })
  warehouses: Warehouse[];
}
