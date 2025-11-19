import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'ciudades', timestamps: true, toJSON: { virtuals: true } })
export class Ciudad extends Document {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true, unique: true })
  codigo_postal: string;
}

export const CiudadSchema = SchemaFactory.createForClass(Ciudad);
