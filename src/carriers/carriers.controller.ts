// src/carriers/carriers.controller.ts
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CarriersService } from './carriers.service';
import { CreateCarrierDto } from './dto/create-carrier.dto';
import { UpdateCarrierDto } from './dto/update-carrier.dto';
import { QuoteRequestDto } from './dto/quote-request.dto';
import { QuoteResponseDto } from './dto/quote-response.dto';

@ApiTags('Carriers')
@Controller("carriers")
export class CarriersController {
  constructor(private readonly carriersService: CarriersService) {}

  @Post('/quote')
  @ApiOperation({
    summary: 'Cotizar envío',
    description:
      'Obtiene el costo de envío usando códigos de Chilexpress directamente  ' +
      'Para obtener los códigos correctos, usar primero GET /geo/chilexpress/regions y luego GET /geo/chilexpress/coverage-areas',
  })
  @ApiBody({
    type: QuoteRequestDto,
    examples: {
      'Usando countyCode': {
        value: {
          originCountyCode: 'STGO',
          destinationCountyCode: 'PROV',
          package: {
            weight: '2.5',
            height: '15',
            width: '25',
            length: '35',
          },
          productType: 3,
          contentType: 1,
          declaredWorth: '25000',
          deliveryTime: 0,
        },
      },
    },
  })
  @ApiOkResponse({
    type: QuoteResponseDto,
    description: 'Cotización exitosa con opciones de servicio',
  })
  async quote(@Body() dto: QuoteRequestDto): Promise<QuoteResponseDto> {
    return this.carriersService.quote(dto);
  }



  @Post()
  @ApiOperation({ summary: 'Crear un nuevo carrier' })
  create(@Body() dto: CreateCarrierDto) {
    return this.carriersService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los carriers' })
  findAll() {
    return this.carriersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener carrier por ID' })
  findById(@Param('id') id: string) {
    return this.carriersService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar carrier' })
  update(@Param('id') id: string, @Body() dto: UpdateCarrierDto) {
    return this.carriersService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar carrier' })
  delete(@Param('id') id: string) {
    return this.carriersService.delete(id);
  }
}
