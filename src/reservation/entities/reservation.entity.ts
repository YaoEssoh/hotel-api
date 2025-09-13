import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Types } from "mongoose";

@Schema()
export class Reservation {
    
     
        @Prop()
        dateDebut  : Date
        @Prop()
        dateFin  : Date
        @Prop({default : "Pending"})
        statut : string
        @Prop()
        total : number
        @Prop()
        nombreDeNuits : number
        @Prop( {type:mongoose.Schema.Types.ObjectId, ref:'chambre'})
        chambre : Types.ObjectId;
        @Prop({type: mongoose.Schema.Types.ObjectId, ref:'paiement'})
        paiement: Types.ObjectId;
        @Prop({type:  [{type:mongoose.Schema.Types.ObjectId, ref:'utilisateur'}]})
        client : Types.ObjectId[]
    
    
  
}
export const reservationSchema=SchemaFactory.createForClass(Reservation);
