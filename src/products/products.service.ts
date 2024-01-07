import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from './product.entity';
import { CreateProductDto } from './dto/v1/create-product.dto';
import { UpdateProductDto } from './dto/v1/update-product.dto';
import { InventoriesService } from '../inventories/inventories.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    private readonly inventoriesService: InventoriesService,
  ) {}

  async getBySku(sku: number): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { sku },
      relations: ['inventory', 'inventory.warehouses'],
    });

    if (!product) {
      throw new BadRequestException('Produto não encontrado');
    }

    product.inventory.quantity = product.inventory.quantity + 1;
    product.isMarketable = product.inventory.quantity > 0;

    this.update(product.sku, product);

    return product;
  }

  async create(product: CreateProductDto): Promise<Product> {
    const productExists = await this.productsRepository.findOne({
      where: { sku: product.sku },
    });

    if (productExists) {
      throw new BadRequestException(
        'Dois produtos são considerados iguais se os seus skus forem iguais',
      );
    }

    const inventory = await this.inventoriesService.create(product.inventory);
    product.inventory = inventory;

    const newProduct = this.productsRepository.create(product);
    return await this.productsRepository.save(newProduct);
  }

  async update(sku: number, product: UpdateProductDto): Promise<Product> {
    const productExists = await this.productsRepository.findOne({
      where: { sku },
    });

    if (!productExists) {
      throw new BadRequestException('Produto não encontrado');
    }

    const updatedProduct = this.productsRepository.merge(
      productExists,
      product,
    );

    return this.productsRepository.save(updatedProduct);
  }

  async delete(sku: number): Promise<void> {
    const productExists = await this.productsRepository.findOne({
      where: { sku },
    });

    if (!productExists) {
      throw new BadRequestException('Produto não encontrado');
    }

    await this.productsRepository.delete({ sku });
  }
}
