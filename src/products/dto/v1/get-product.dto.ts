import { ApiProperty } from '@nestjs/swagger';
import { GetInventoryDto } from '../../../inventories/dto/v1/get-inventory.dto';

export class GetProductDto {
  @ApiProperty()
  sku: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ type: GetInventoryDto })
  inventory: GetInventoryDto;

  @ApiProperty()
  isMarketable: boolean;
}
