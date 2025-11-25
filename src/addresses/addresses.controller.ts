//src/addresses/addresses.controller.ts
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { CrearDireccionDto } from './dto/create-address.dto';
import { ActualizarDireccionDto } from './dto/update-address.dto';

@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressService: AddressesService) {}

  @Post()
  create(@Body() dto: CrearDireccionDto) {
    return this.addressService.create(dto);
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
  update(@Param('id') id: string, @Body() dto: ActualizarDireccionDto) {
    return this.addressService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.addressService.delete(id);
  }

  
}
