import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Inventory } from './inventory.entity';
import { InventoriesService } from './inventories.service';
import { WarehousesModule } from '../warehouses/warehouses.module';

@Module({
  imports: [TypeOrmModule.forFeature([Inventory]), WarehousesModule],
  providers: [InventoriesService],
  exports: [InventoriesService],
})
export class InventoriesModule {}
