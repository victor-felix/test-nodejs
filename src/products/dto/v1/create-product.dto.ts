import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsObject, IsString, Min } from 'class-validator';
import { CreateInventoryDto } from '../../../inventories/dto/v1/create-inventory.dto';

export class CreateProductDto {
  @ApiProperty()
  @IsNumber()
  @Min(1)
  sku: number;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ type: CreateInventoryDto })
  @IsObject()
  inventory: CreateInventoryDto;
}
