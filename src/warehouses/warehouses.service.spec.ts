import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { INestApplication } from '@nestjs/common';

import { WarehousesService } from './warehouses.service';
import { Warehouse } from './warehouse.entity';
import { Product } from '../products/product.entity';
import { Inventory } from '../inventories/inventory.entity';

describe('WarehousesService', () => {
  let warehouseService: WarehousesService;
  let warehouseRepository: Repository<Warehouse>;
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'better-sqlite3',
          database:
            'db-test' + (new Date().getTime() * Math.random()).toString(16),
          synchronize: true,
          entities: [Product, Inventory, Warehouse],
          logging: false,
        }),
        TypeOrmModule.forFeature([Product, Inventory, Warehouse]),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    warehouseRepository = moduleFixture.get('WarehouseRepository');
    warehouseService = new WarehousesService(warehouseRepository);

    await warehouseRepository.clear();
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    await warehouseRepository.clear();
  });

  it('should be defined', () => {
    expect(warehouseService).toBeDefined();
  });

  // it('should create many warehouses', async () => {
  //   const warehouses: DeepPartial<Warehouse[]> = [
  //     { locality: 'Locality 1', quantity: 1, type: 'type 1' },
  //     { locality: 'Locality 2', quantity: 2, type: 'type 2' },
  //   ];

  //   const result = await service.createMany(warehouses);

  //   expect(result).toEqual([
  //     { id: 1, locality: 'Locality 1', quantity: 1, type: 'type 1' },
  //     { id: 2, locality: 'Locality 2', quantity: 2, type: 'type 2' },
  //   ]);
  // });
});
