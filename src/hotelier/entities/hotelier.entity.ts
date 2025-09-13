import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Types } from "mongoose";
import { Utilisateur } from "src/utilisateur/entities/utilisateur.entity";

@Schema()
export class Hotelier extends Utilisateur {
   role : string
   @Prop()
   adress : string
   @Prop({default:"en attente"})
   activer:string
   @Prop([{type:mongoose.Schema.Types.ObjectId, ref:'hotel'}])
   hotel : Types.ObjectId[]
}
export const hotelierSchema=SchemaFactory.createForClass(Hotelier)

