import { IsNotEmpty, IsString } from "class-validator"
import { Types } from "mongoose"

export class CreatePaiementDto {
        @IsString()
        @IsNotEmpty()
        montant: number
        @IsString()
        @IsNotEmpty()
        methode : String
        @IsNotEmpty()
        @IsString()
        statut : String
        @IsNotEmpty()
        @IsString()
        Nombrereservation : String
        reservation: Types.ObjectId;
        
}
