import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Types } from "mongoose";
import { Utilisateur } from "src/utilisateur/entities/utilisateur.entity";

@Schema()
export class Client extends Utilisateur {
    @Prop()
    profil : string  
    role : string 
    @Prop({type: mongoose.Schema.Types.ObjectId, ref:'reservation'})
    reservation: Types.ObjectId;
   @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reclamation' }] })
    reclamations?: Types.ObjectId[];
    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Evaluation' }] })
    evaluation: Types.ObjectId[];


}
export const clientSchema=SchemaFactory.createForClass(Client)

