// src/carriers/carriers.controller.ts
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { CarriersService } from './carriers.service';
import { CreateCarrierDto } from './dto/create-carrier.dto';
import { UpdateCarrierDto } from './dto/update-carrier.dto';
import { DeliveryDto } from '../contracts/delivery.dto';

@Controller("carriers")
export class CarriersController {
  constructor(private readonly carriersService: CarriersService) {}

  @Get('/coverages')
  async coverages() {
    return this.carriersService.listCoverages();
  }

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
  @ApiOkResponse()
  async quote(@Body() dto: DeliveryDto) {
    return this.carriersService.quote(dto);
  }
}
