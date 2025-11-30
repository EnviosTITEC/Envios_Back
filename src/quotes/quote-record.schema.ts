import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class QuoteRecord extends Document {
  @Prop({ type: Object, required: true })
  data: Record<string, any>;
}

export const QuoteRecordSchema = SchemaFactory.createForClass(QuoteRecord);
