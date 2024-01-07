import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { INestApplication } from '@nestjs/common';

import { InventoriesService } from './inventories.service';
import { WarehousesService } from '../warehouses/warehouses.service';
import { Warehouse } from '../warehouses/warehouse.entity';
import { Inventory } from './inventory.entity';
import { Product } from '../products/product.entity';

describe('InventoriesService', () => {
  let inventoryService: InventoriesService;
  let warehouseService: WarehousesService;
  let inventoryRepository: Repository<Inventory>;
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
    inventoryRepository = moduleFixture.get('InventoryRepository');
    inventoryService = new InventoriesService(
      inventoryRepository,
      warehouseService,
    );

    await warehouseRepository.clear();
    await inventoryRepository.clear();
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    await warehouseRepository.clear();
    await inventoryRepository.clear();
  });

  it('should be defined', () => {
    expect(inventoryService).toBeDefined();
  });

  it('should create an inventory', async () => {
    const inventory = {
      quantity: 1,
      warehouses: [
        {
          locality: 'SP',
          quantity: 12,
          type: 'ECOMMERCE',
        },
        {
          locality: 'MOEMA',
          quantity: 3,
          type: 'PHYSICAL_STORE',
        },
      ],
    };

    const result = await inventoryService.create(inventory);

    expect(result).toEqual({
      id: 1,
      quantity: 1,
      warehouses: [
        {
          id: 1,
          locality: 'SP',
          quantity: 12,
          type: 'ECOMMERCE',
        },
        {
          id: 2,
          locality: 'MOEMA',
          quantity: 3,
          type: 'PHYSICAL_STORE',
        },
      ],
    });
  });

  it('should update an inventory', async () => {
    const inventory = {
      quantity: 10,
    };

    await inventoryService.update(8, inventory);

    expect(inventoryService).toBeDefined();
  });
});
