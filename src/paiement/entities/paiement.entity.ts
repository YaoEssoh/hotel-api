import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import mongoose, { Types } from "mongoose"

@Schema()
export class Paiement {
         @Prop()
         montant: number
         @Prop()
         methode : String
         @Prop()
         statut : String
         @Prop()
         NombreReservation : String
         @Prop({type: mongoose.Schema.Types.ObjectId, ref:'reservation'})
         reservation: Types.ObjectId;
     
}
export const paiementSchema=SchemaFactory.createForClass(Paiement)

