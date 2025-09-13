import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Types } from "mongoose";

@Schema()
export class Chambre {
  @Prop()
  numero: number;
  @Prop()
  image: string;
  @Prop()
  capacite: number;
  @Prop()
  status: string;
  @Prop()
  description: string;
  @Prop()
  equipement: string;
  @Prop()
  views: string;
  @Prop()
  prix: number;
  @Prop()
  prixForChild: number;
  @Prop({ default: true })
  disponibilité: boolean;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'reservation' }],
  })
  reservation: Types.ObjectId[];
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'hotel' })
  hotel: Types.ObjectId;
}
export const chambreSchema=SchemaFactory.createForClass(Chambre)

