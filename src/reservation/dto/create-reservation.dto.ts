import { Type } from "class-transformer"
import { IsDate, IsDateString, isNotEmpty, IsNotEmpty, IsNumber, IsString } from "class-validator"
import { Types } from "mongoose"

export class CreateReservationDto {
       
       
        @IsDateString()
        @IsNotEmpty()
        dateDebut : Date
        @IsDateString()
        @IsNotEmpty()
        dateFin : Date
      
        statut : string
        total: number
        @Type(()=>Number)
        @IsNumber()
        @IsNotEmpty()
        nombreDeNuits : number
        chambre : Types.ObjectId;
        paiement: Types.ObjectId;
        client : Types.ObjectId[]       
}
