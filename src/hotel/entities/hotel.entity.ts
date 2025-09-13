import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types } from "mongoose";
import { Chambre } from "src/chambre/entities/chambre.entity";

export type HotelDocument = HydratedDocument<Hotel>;

@Schema({ toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Hotel {
  @Prop()
  nom: string;

  @Prop()
  description: string;

  @Prop()
  adress: string;

  @Prop()
  nombreEtoiles: number;

  @Prop()
  telephone: number;

  @Prop()
  email: string;

  @Prop()
  nombreDeChambre: number;

  @Prop()
  service: string;

  @Prop()
  tarifMoyen: number;

  @Prop([String])
  images: string[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chambre" }] })
  chambre: Chambre[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Hotelier" })
  hotelier: Types.ObjectId;

  // ❌ on supprime le vrai champ evaluation
  // ✅ on va utiliser un virtual populate à la place
}

export const hotelSchema = SchemaFactory.createForClass(Hotel);

// 🔥 Définition du Virtual Populate
hotelSchema.virtual("evaluation", {
  ref: "Evaluation",         // Nom du modèle à peupler
  localField: "_id",         // Clé locale (l'id de l'hôtel)
  foreignField: "hotel",     // Clé étrangère dans Evaluation
});


// très important : activer les virtuals dans JSON
hotelSchema.set('toObject', { virtuals: true });
hotelSchema.set('toJSON', { virtuals: true });