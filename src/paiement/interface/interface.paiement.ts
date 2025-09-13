import { Types } from "mongoose";
import { Document } from "mongoose";
export interface IPaiement extends Document{
    readonly montant: number
    readonly methode : String
    readonly statut : String
    readonly NombreReservation : string
    reservation: Types.ObjectId;
}
