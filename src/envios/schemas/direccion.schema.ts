import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DireccionDocument = Direccion & Document;

@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class Direccion {
  @Prop({ required: true })
  calle: string;

  @Prop({ required: true })
  numero: string;

  @Prop({ required: true })
  comuna: string;

  @Prop({ required: true })
  provincia: string;

  @Prop()
  region?: string;

  @Prop()
  codigoPostal?: string;

  @Prop()
  referencias?: string;

  @Prop({ required: true })
  usuarioId: string; // referencia a usuario
}

export const DireccionSchema = SchemaFactory.createForClass(Direccion);
DireccionSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
