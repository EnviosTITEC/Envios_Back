import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EnviosService } from './envios.service';
import { EnviosController } from './envios.controller';
import { Direccion, DireccionSchema } from './schemas/direccion.schema';
import { Transportista, TransportistaSchema } from './schemas/transportista.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Direccion.name, schema: DireccionSchema },
      { name: Transportista.name, schema: TransportistaSchema },
    ]),
  ],
  controllers: [EnviosController],
  providers: [EnviosService],
})
export class EnviosModule {}
