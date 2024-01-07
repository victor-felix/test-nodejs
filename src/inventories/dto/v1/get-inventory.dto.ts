import { ApiProperty } from '@nestjs/swagger';
import { CreateWarehouseDto } from '../../../warehouses/dto/v1/create-warehouse.dto';

export class GetInventoryDto {
  @ApiProperty()
  quantity: number;

  @ApiProperty({ type: [CreateWarehouseDto] })
  warehouses: CreateWarehouseDto[];
}
