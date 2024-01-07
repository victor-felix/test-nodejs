import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { CreateWarehouseDto } from '../../../warehouses/dto/v1/create-warehouse.dto';

export class CreateInventoryDto {
  @ApiProperty({ type: [CreateWarehouseDto] })
  @IsArray()
  warehouses: CreateWarehouseDto[];
}
