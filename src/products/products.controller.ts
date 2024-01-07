import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/v1/create-product.dto';
import { UpdateProductDto } from './dto/v1/update-product.dto';
import { GetProductDto } from './dto/v1/get-product.dto';
import { ParamProductDto } from './dto/v1/param-product.dto';

@ApiTags('Products V1')
@Controller({ version: '1', path: 'products' })
export class ProductsControllerV1 {
  constructor(private readonly productService: ProductsService) {}

  @Post()
  @HttpCode(201)
  @ApiBody({ type: CreateProductDto })
  @ApiBadRequestResponse({
    description:
      'Dois produtos são considerados iguais se os seus skus forem iguais',
  })
  @ApiCreatedResponse({
    type: CreateProductDto,
    description: 'Produto criado com sucesso',
  })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Put(':sku')
  @HttpCode(200)
  @ApiBody({ type: UpdateProductDto })
  @ApiBadRequestResponse({
    description: 'Produto não encontrado',
  })
  @ApiCreatedResponse({
    type: UpdateProductDto,
    description: 'Produto atualizado com sucesso',
  })
  update(
    @Param() params: ParamProductDto,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(params.sku, updateProductDto);
  }

  @Get(':sku')
  @HttpCode(200)
  @ApiBadRequestResponse({ description: 'Produto não encontrado' })
  @ApiOkResponse({ type: GetProductDto, description: 'Produto encontrado' })
  get(@Param() params: ParamProductDto) {
    return this.productService.getBySku(params.sku);
  }

  @Delete(':sku')
  @HttpCode(204)
  @ApiBadRequestResponse({ description: 'Produto não encontrado' })
  @ApiNoContentResponse({ description: 'Produto deletado com sucesso' })
  delete(@Param() params: ParamProductDto) {
    return this.productService.delete(params.sku);
  }
}
