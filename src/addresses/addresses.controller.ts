//src/addresses/addresses.controller.ts
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, BadRequestException } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { AddressesService } from './addresses.service';
import { CrearDireccionDto } from './dto/create-address.dto';
import { ActualizarDireccionDto } from './dto/update-address.dto';
import { plainToInstance } from 'class-transformer';
import { validateOrReject, ValidationError } from 'class-validator';
import { mapFrontendAddressToInternal } from '../utils/mappers';

@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressService: AddressesService) {}

  @Post()
  @ApiBody({
    type: CrearDireccionDto,
    description: 'Datos para crear una dirección',
    examples: {
      ejemplo1: {
        summary: 'Dirección completa',
        value: {
          "calle": "General Cruz",
          "numero": "222",
          "comuna_id": "VALPARAISO",
          "codigo_comuna": "PLAS",
          "region_id": "VALPARAISO",
          "codigo_postal": "",
          "referencias": "",
          "usuario_id": "1"
        }
      }
    }
  })
  async create(@Body() body: any) {
    const mapped = mapFrontendAddressToInternal(body);
    const dto = plainToInstance(CrearDireccionDto, mapped);
    try {
      await validateOrReject(dto as any, { whitelist: true, forbidUnknownValues: false });
    } catch (errs) {
      const messages = (errs as ValidationError[])
        .flatMap(e => Object.values(e.constraints || {}));
      throw new BadRequestException(messages);
    }
    return this.addressService.create(dto as CrearDireccionDto);
  }

  @Get()
  findAll(@Query('userId') userId: string) {
    return this.addressService.findAll(userId);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.addressService.findById(id);
  }

  @Patch(':id')
  @ApiBody({ type: ActualizarDireccionDto, description: 'Datos para actualizar una dirección' })
  async update(@Param('id') id: string, @Body() body: any) {
    const mapped = mapFrontendAddressToInternal(body);
    const dto = plainToInstance(ActualizarDireccionDto, mapped);
    try {
      await validateOrReject(dto as any, { whitelist: true, forbidUnknownValues: false });
    } catch (errs) {
      const messages = (errs as ValidationError[])
        .flatMap(e => Object.values(e.constraints || {}));
      throw new BadRequestException(messages);
    }
    return this.addressService.update(id, dto as ActualizarDireccionDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.addressService.delete(id);
  }

  
}
