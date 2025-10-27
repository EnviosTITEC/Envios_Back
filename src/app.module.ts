import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AddressModule } from './addresses/addresses.module';
import { CityModule as CountriesModule } from './cities/cities.module';
import { CarriersModule } from './carriers/carriers.module';
import { DeliveriesModule } from './deliveries/deliveries.module';
import { PostalModule } from './postal/postal.module'; // <-- asegúrate que este import exista

@Module({
  imports: [
    // variables de entorno globales
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // conexión a MongoDB
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
    }),

    // módulos de la app
    AuthModule,
    UsersModule,
    AddressModule,
    CountriesModule,
    CarriersModule,
    DeliveriesModule,
    PostalModule, // <-- mantenlo aquí
  ],
})
export class AppModule {}
