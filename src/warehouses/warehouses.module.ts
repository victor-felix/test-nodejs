import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Warehouse } from './warehouse.entity';
import { WarehousesService } from './warehouses.service';

@Module({
  imports: [TypeOrmModule.forFeature([Warehouse])],
  providers: [WarehousesService],
  exports: [WarehousesService],
})
export class WarehousesModule {}
