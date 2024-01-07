import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsObject, IsOptional, IsString } from 'class-validator';

import { CreateInventoryDto } from '../../../inventories/dto/v1/create-inventory.dto';

export class UpdateProductDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  inventory: CreateInventoryDto;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isMarketable: boolean;
}
