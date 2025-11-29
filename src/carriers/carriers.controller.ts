// src/carriers/carriers.controller.ts
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CarriersService } from './carriers.service';
import { CrearTransportistaDto } from './dto/create-carrier.dto';
import { ActualizarTransportistaDto } from './dto/update-carrier.dto';
import { SolicitudCotizacionDto } from './dto/quote-request.dto';
import { RespuestaCotizacionDto } from './dto/quote-response.dto';

@ApiTags('Carriers')
@Controller("carriers")
export class CarriersController {
  constructor(private readonly carriersService: CarriersService) {}





  @Post()
  @ApiOperation({ summary: 'Crear un nuevo carrier' })
  create(@Body() dto: CrearTransportistaDto) {
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
  update(@Param('id') id: string, @Body() dto: ActualizarTransportistaDto) {
    return this.carriersService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar carrier' })
  delete(@Param('id') id: string) {
    return this.carriersService.delete(id);
  }
}
