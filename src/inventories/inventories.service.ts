import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';

import { Inventory } from './inventory.entity';
import { WarehousesService } from '../warehouses/warehouses.service';

@Injectable()
export class InventoriesService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoriesRepository: Repository<Inventory>,
    private readonly warehousesService: WarehousesService,
  ) {}

  async create(inventory: DeepPartial<Inventory>): Promise<Inventory> {
    const warehouses = await this.warehousesService.createMany(
      inventory.warehouses,
    );

    const newInventory = this.inventoriesRepository.create(inventory);

    newInventory.warehouses = warehouses;

    return await this.inventoriesRepository.save(newInventory);
  }

  async update(id: number, inventory: DeepPartial<Inventory>): Promise<void> {
    await this.inventoriesRepository.update(id, inventory);
  }
}
