import { Module } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductsModule } from './products/products.module';
import { InventoriesModule } from './inventories/inventories.module';
import { WarehousesModule } from './warehouses/warehouses.module';
import { Product } from './products/product.entity';
import { Inventory } from './inventories/inventory.entity';
import { Warehouse } from './warehouses/warehouse.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'db',
      synchronize: true,
      entities: [Product, Inventory, Warehouse],
      logging: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: parseInt(process.env.THROTTLER_TTL),
        limit: parseInt(process.env.THROTTLER_LIMIT),
      },
    ]),
    ProductsModule,
    InventoriesModule,
    WarehousesModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
