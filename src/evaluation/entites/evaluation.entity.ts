import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { Client } from 'src/client/entities/client.entity';
import { Hotel } from 'src/hotel/entities/hotel.entity';

@Schema()
export class Evaluation extends Document {
  @Prop({ required: true })
  note: number;

  @Prop()
  commentaire: string;

  @Prop({ default: Date.now })
  date: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true })
  hotel: Hotel;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true })
  client: Client;
}

export const EvaluationSchema = SchemaFactory.createForClass(Evaluation);
