import { Types } from "mongoose"
import { Document } from "mongoose"

export interface IReservation extends Document{
    readonly  dateDebut  : Date
    readonly  dateFin  : Date 
    readonly  statut : string
     total :number
    readonly nombreDeNuits : string
    chambre : Types.ObjectId;
    paiement: Types.ObjectId;
    client : Types.ObjectId[]


    
}
