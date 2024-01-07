import { IsNumber } from 'class-validator';

export class ParamProductDto {
  @IsNumber()
  sku: number;
}
