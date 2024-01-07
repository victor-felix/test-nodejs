import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { Inventory } from '../inventories/inventory.entity';

@Entity('products')
export class Product {
  @Column({ primary: true })
  sku: number;

  @Column()
  name: string;

  @Column({ default: false })
  isMarketable: boolean;

  @OneToOne(() => Inventory, (inventory) => inventory.product, {
    cascade: ['insert', 'update'],
  })
  @JoinColumn()
  inventory: Inventory;
}
