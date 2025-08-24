import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { EnviosService } from './envios.service';
import { CreateDireccionDto } from './dto/create-direccion.dto';
import { UpdateDireccionDto } from './dto/update-direccion.dto';
import { CreateTransportistaDto } from './dto/create-transportista.dto';
import { UpdateTransportistaDto } from './dto/update-transportista.dto';

@Controller('envios')
export class EnviosController {
  constructor(private readonly enviosService: EnviosService) {}

  // ----- DIRECCIONES -----
  @Post('direcciones')
  createDireccion(@Body() dto: CreateDireccionDto) {
    return this.enviosService.createDireccion(dto);
  }

  @Get('direcciones')
  findAllDirecciones(@Query('usuarioId') usuarioId: string) {
    return this.enviosService.findAllDirecciones(usuarioId);
  }

  @Get('direcciones/:id')
  findDireccionById(@Param('id') id: string) {
    return this.enviosService.findDireccionById(id);
  }

  @Patch('direcciones/:id')
  updateDireccion(@Param('id') id: string, @Body() dto: UpdateDireccionDto) {
    return this.enviosService.updateDireccion(id, dto);
  }

  @Delete('direcciones/:id')
  deleteDireccion(@Param('id') id: string) {
    return this.enviosService.deleteDireccion(id);
  }

  // ----- TRANSPORTISTAS -----
  @Post('transportistas')
  createTransportista(@Body() dto: CreateTransportistaDto) {
    return this.enviosService.createTransportista(dto);
  }

  @Get('transportistas')
  findAllTransportistas() {
    return this.enviosService.findAllTransportistas();
  }

  @Get('transportistas/:id')
  findTransportistaById(@Param('id') id: string) {
    return this.enviosService.findTransportistaById(id);
  }

  @Patch('transportistas/:id')
  updateTransportista(@Param('id') id: string, @Body() dto: UpdateTransportistaDto) {
    return this.enviosService.updateTransportista(id, dto);
  }

  @Delete('transportistas/:id')
  deleteTransportista(@Param('id') id: string) {
    return this.enviosService.deleteTransportista(id);
  }
}
