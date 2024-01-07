import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule /* getRepositoryToken */ } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { INestApplication } from '@nestjs/common';

import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { InventoriesService } from '../inventories/inventories.service';
import { Inventory } from '../inventories/inventory.entity';
import { WarehousesService } from '../warehouses/warehouses.service';
import { Warehouse } from '../warehouses/warehouse.entity';

describe('ProductsService', () => {
  let productService: ProductsService;
  let inventoryService: InventoriesService;
  let warehouseService: WarehousesService;
  let productRepository: Repository<Product>;
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
    productRepository = moduleFixture.get('ProductRepository');
    productService = new ProductsService(productRepository, inventoryService);

    await warehouseRepository.clear();
    await productRepository.clear();
    await inventoryRepository.clear();
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    await warehouseRepository.clear();
    await productRepository.clear();
  });

  it('should be defined', async () => {
    expect(productService).toBeDefined();
  });

  it('should return error on get product by sku', async () => {
    try {
      await productService.getBySku(1);
    } catch (error) {
      expect(error.message).toBe('Produto não encontrado');
    }
  });

  it('should return result as successfully on get product by sku', async () => {
    const productMock = {
      sku: 43264,
      name: "L'Oréal Professionnel Expert Absolut Repair Cortex Lipidium - Máscara de Reconstrução 500g",
      inventory: {
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
      },
    };

    const product = await productService.create(productMock);
    const productFound = await productService.getBySku(product.sku);
    expect(productFound).toEqual({
      sku: 43264,
      name: "L'Oréal Professionnel Expert Absolut Repair Cortex Lipidium - Máscara de Reconstrução 500g",
      isMarketable: true,
      inventory: {
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
      },
    });
  });

  it('should return error on create an exist product', async () => {
    const productMock = {
      sku: 43264,
      name: "L'Oréal Professionnel Expert Absolut Repair Cortex Lipidium - Máscara de Reconstrução 500g",
      inventory: {
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
      },
    };

    try {
      await productService.create(productMock);
      await productService.create(productMock);
    } catch (error) {
      expect(error.message).toBe(
        'Dois produtos são considerados iguais se os seus skus forem iguais',
      );
    }
  });

  it('should return a product marktable as successfully on get product by sku', async () => {
    const productMock = {
      sku: 43264,
      name: "L'Oréal Professionnel Expert Absolut Repair Cortex Lipidium - Máscara de Reconstrução 500g",
      inventory: {
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
      },
    };

    const product = await productService.create(productMock);
    const productFound = await productService.getBySku(product.sku);
    expect(productFound.isMarketable).toEqual(true);
  });

  it('should return result as successfully on create a new product', async () => {
    const productMock = {
      sku: 43264,
      name: "L'Oréal Professionnel Expert Absolut Repair Cortex Lipidium - Máscara de Reconstrução 500g",
      inventory: {
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
      },
    };

    const product = await productService.create(productMock);
    expect(product).toEqual({
      sku: 43264,
      name: "L'Oréal Professionnel Expert Absolut Repair Cortex Lipidium - Máscara de Reconstrução 500g",
      isMarketable: false,
      inventory: {
        id: 4,
        quantity: 0,
        warehouses: [
          {
            id: 7,
            locality: 'SP',
            quantity: 12,
            type: 'ECOMMERCE',
          },
          {
            id: 8,
            locality: 'MOEMA',
            quantity: 3,
            type: 'PHYSICAL_STORE',
          },
        ],
      },
    });
  });

  it('should return error on update a non saved product', async () => {
    try {
      await productService.update(43264, {
        isMarketable: true,
        name: "L'Oréal Professionnel Expert Absolut Repair Cortex Lipidium - Máscara de Reconstrução 500g",
        inventory: {
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
        },
      });
    } catch (error) {
      expect(error.message).toBe('Produto não encontrado');
    }
  });

  it('should return result as successfully on update a saved product', async () => {
    const productMock = {
      sku: 43264,
      name: "L'Oréal Professionnel Expert Absolut Repair Cortex Lipidium - Máscara de Reconstrução 500g",
      inventory: {
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
      },
    };

    const product = await productService.create(productMock);
    const productUpdated = await productService.update(product.sku, {
      isMarketable: true,
      name: 'Produto Atualizado',
      inventory: {
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
      },
    });

    expect(productUpdated).toEqual({
      sku: 43264,
      name: 'Produto Atualizado',
      isMarketable: true,
      inventory: {
        id: 6,
        quantity: 0,
        warehouses: [
          {
            id: 11,
            locality: 'SP',
            quantity: 12,
            type: 'ECOMMERCE',
          },
          {
            id: 12,
            locality: 'MOEMA',
            quantity: 3,
            type: 'PHYSICAL_STORE',
          },
        ],
      },
    });
  });

  it('should return error on delete a non saved product', async () => {
    try {
      await productService.delete(43264);
    } catch (error) {
      expect(error.message).toBe('Produto não encontrado');
    }
  });

  it('should return result as successfully on delete a saved product', async () => {
    const productMock = {
      sku: 43264,
      name: "L'Oréal Professionnel Expert Absolut Repair Cortex Lipidium - Máscara de Reconstrução 500g",
      inventory: {
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
      },
    };

    const product = await productService.create(productMock);
    const productDeleted = await productService.delete(product.sku);
    expect(productDeleted).toEqual(undefined);
  });
});
