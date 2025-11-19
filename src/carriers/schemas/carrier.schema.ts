import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CarrierDocument = Carrier & Document;

@Schema({
  collection: 'transportistas', // Cambiado para cumplir con la nomenclatura
  timestamps: true,
  toJSON: { virtuals: true },
})
export class Carrier {
  @Prop({ required: true, unique: true, index: true })
  codigo: string; // Cambiado de 'code' a 'codigo'

  @Prop({ required: true })
  nombre: string; // Cambiado de 'name' a 'nombre'

  @Prop({ type: JSON, required: true })
  credenciales: JSON; // Cambiado de 'credentials' a 'credenciales'

  @Prop({ default: true })
  disponible: boolean; // Cambiado de 'isAvailable' a 'disponible'
}

export const CarrierSchema = SchemaFactory.createForClass(Carrier);
CarrierSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
