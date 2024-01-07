import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';

import { Warehouse } from './warehouse.entity';

@Injectable()
export class WarehousesService {
  constructor(
    @InjectRepository(Warehouse)
    private readonly warehousesRepository: Repository<Warehouse>,
  ) {}

  async createMany(warehouses: DeepPartial<Warehouse[]>): Promise<Warehouse[]> {
    const newWarehouses = this.warehousesRepository.create(warehouses);
    return this.warehousesRepository.save(newWarehouses);
  }
}
