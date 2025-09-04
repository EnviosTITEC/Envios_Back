import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AddressModule } from './addresses/addresses.module';
import { CityModule as CountriesModule } from './cities/cities.module';
import { CarriersModule } from './carriers/carriers.module';
import { DeliveriesModule } from './deliveries/deliveries.module';

@Module({
  imports: [
    // Carga y valida las variables de entorno
    ConfigModule.forRoot({
      isGlobal: true, // Disponible en toda la aplicación
    }),
    // Conexión a MongoDB
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
    }),
    // Módulos de la aplicación
  AuthModule,
  UsersModule,
  AddressModule,
  CountriesModule,
  CarriersModule,
  DeliveriesModule,
  ],
})
export class AppModule {}