import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'cities', timestamps: true, toJSON: { virtuals: true } })
export class City extends Document {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true, unique: true })
  codigoPostal: string;

  // Compatibility getters/setters (TypeScript)
  get name(): string {
    return (this as any).nombre;
  }
  set name(v: string) {
    (this as any).nombre = v;
  }

  get postal_code(): string {
    return (this as any).codigoPostal;
  }
  set postal_code(v: string) {
    (this as any).codigoPostal = v;
  }
}

export const CitySchema = SchemaFactory.createForClass(City);

// Virtuals English -> Spanish
CitySchema.virtual('name')
  .get(function () {
    return this.nombre;
  })
  .set(function (v) {
    this.nombre = v;
  });

CitySchema.virtual('postal_code')
  .get(function () {
    return this.codigoPostal;
  })
  .set(function (v) {
    this.codigoPostal = v;
  });
