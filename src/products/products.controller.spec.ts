import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsControllerV1 } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { InventoriesService } from '../inventories/inventories.service';
import { Inventory } from '../inventories/inventory.entity';
import { WarehousesService } from '../warehouses/warehouses.service';
import { Warehouse } from '../warehouses/warehouse.entity';
import { Repository } from 'typeorm';
import { INestApplication } from '@nestjs/common';
import { ParamProductDto } from './dto/v1/param-product.dto';
import { UpdateProductDto } from './dto/v1/update-product.dto';
import { ProductsModule } from './products.module';

describe('ProductsControllerV1', () => {
  let controller: ProductsControllerV1;
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
        ProductsModule,
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
    controller = new ProductsControllerV1(productService);

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
    await inventoryRepository.clear();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a product', async () => {
    const product = {
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

    const result = await controller.create(product);
    expect(result).toEqual({
      sku: 43264,
      name: "L'Oréal Professionnel Expert Absolut Repair Cortex Lipidium - Máscara de Reconstrução 500g",
      isMarketable: false,
      inventory: {
        id: 1,
        quantity: 0,
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

  it('should update a product', async () => {
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
    const result = await controller.update(
      { sku: product.sku } as ParamProductDto,
      {
        name: 'Teste',
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
      } as UpdateProductDto,
    );
    expect(result).toEqual({
      sku: 43264,
      name: 'Teste',
      isMarketable: false,
      inventory: {
        id: 3,
        quantity: 0,
        warehouses: [
          {
            id: 5,
            locality: 'SP',
            quantity: 12,
            type: 'ECOMMERCE',
          },
          {
            id: 6,
            locality: 'MOEMA',
            quantity: 3,
            type: 'PHYSICAL_STORE',
          },
        ],
      },
    });
  });

  it('should get a product', async () => {
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
    const result = await controller.get({
      sku: product.sku,
    } as ParamProductDto);
    expect(result).toEqual({
      sku: 43264,
      name: "L'Oréal Professionnel Expert Absolut Repair Cortex Lipidium - Máscara de Reconstrução 500g",
      isMarketable: true,
      inventory: {
        id: 4,
        quantity: 1,
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

    await productService.create(productMock);
    await expect(controller.create(productMock)).rejects.toThrow(
      'Dois produtos são considerados iguais se os seus skus forem iguais',
    );
  });

  it('should return error on update a product not found', async () => {
    await expect(
      controller.update(
        { sku: 43264 } as ParamProductDto,
        {
          name: 'Teste',
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
        } as UpdateProductDto,
      ),
    ).rejects.toThrow('Produto não encontrado');
  });

  it('should return error on get a product not found', async () => {
    await expect(
      controller.get({
        sku: 43264,
      } as ParamProductDto),
    ).rejects.toThrow('Produto não encontrado');
  });

  it('should return error on delete a product not found', async () => {
    await expect(
      controller.delete({
        sku: 43264,
      } as ParamProductDto),
    ).rejects.toThrow('Produto não encontrado');
  });

  it('should delete a product', async () => {
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
    await controller.delete({
      sku: product.sku,
    } as ParamProductDto);
    await expect(
      controller.get({
        sku: product.sku,
      } as ParamProductDto),
    ).rejects.toThrow('Produto não encontrado');
  });
});
