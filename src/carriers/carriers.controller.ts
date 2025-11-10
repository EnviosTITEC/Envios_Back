import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CarriersService } from './carriers.service';
import { CreateCarrierDto } from './dto/create-carrier.dto';
import { UpdateCarrierDto } from './dto/update-carrier.dto';
import { DeliveryDto } from '../contracts/delivery.dto';

@Controller("carriers")
export class CarriersController {
  constructor(private readonly carriersService: CarriersService) {}

  @Post()
  create(@Body() dto: CreateCarrierDto) {
    return this.carriersService.create(dto);
  }

  @Get()
  findAll() {
    return this.carriersService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.carriersService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCarrierDto) {
    return this.carriersService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.carriersService.delete(id);
  }

  @Post('/quote')
  @ApiBody({ type: DeliveryDto })
  @ApiOkResponse({
    description: 'Quote response',
    schema: {
      example: {
        coverageAreas: [
          {
            countyCode: 'BULN',
            countyName: 'BULNES',
            regionCode: 'R16',
            ineCountyCode: 425,
            queryMode: 1,
            coverageName: 'BULNES',
          },
        ],
        statusCode: 0,
        statusDescription: 'Extraccion exitosa',
        errors: null,
      },
    },
  })
  async quote(@Body() dto: DeliveryDto) {
    return this.carriersService.quote(dto);
  }

  
}
