import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Utilisateur } from "src/utilisateur/entities/utilisateur.entity";
@Schema()
export class Administrateur extends Utilisateur {
    role : string

}
export const administrateurSchema=SchemaFactory.createForClass(Administrateur)

