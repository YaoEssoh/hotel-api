import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as argon2 from "argon2";

@Schema({discriminatorKey:'role'})
export class Utilisateur {
    @Prop()
    nom : string
    @Prop()
    prenom : string
    @Prop()
    numero : number
    @Prop({unique:true})
    email : string
    @Prop()
    motsDePass : string
    refreshToken: string

    
}
export const utilisateurSchema=SchemaFactory.createForClass(Utilisateur).pre('save' , async function() {
    this.motsDePass = await argon2.hash(this.motsDePass)
}
)

