import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TransportistaDocument = Transportista & Document;

@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class Transportista {
  @Prop({ required: true })
  nombre: string;

  @Prop({ type: [String], default: [] })
  zonasCobertura: string[];

  @Prop({ default: true })
  disponible: boolean;

  @Prop({ type: Map, of: Number }) // tarifa por zona
  tarifas: Map<string, number>;
}

export const TransportistaSchema = SchemaFactory.createForClass(Transportista);
TransportistaSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
