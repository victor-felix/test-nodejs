import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductsService } from './products.service';
import { ProductsControllerV1 } from './products.controller';
import { Product } from './product.entity';
import { InventoriesModule } from '../inventories/inventories.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), InventoriesModule],
  providers: [ProductsService],
  controllers: [ProductsControllerV1],
})
export class ProductsModule {}
