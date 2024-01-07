import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Inventory } from '../inventories/inventory.entity';

@Entity('warehouses')
export class Warehouse {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  locality: string;

  @Column()
  quantity: number;

  @Column()
  type: string;

  @ManyToOne(() => Inventory, (inventory) => inventory.warehouses, {
    cascade: ['insert', 'update'],
  })
  inventory: Inventory;
}
