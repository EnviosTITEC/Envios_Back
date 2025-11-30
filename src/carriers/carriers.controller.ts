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






}
