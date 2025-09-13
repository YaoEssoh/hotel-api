import { IsNotEmpty, IsString } from "class-validator";
import { Types } from "mongoose";
import { CreateUtilisateurDto } from "src/utilisateur/dto/create-utilisateur.dto";

export class CreateHotelierDto extends CreateUtilisateurDto {
   
    role : string
    @IsString()
    @IsNotEmpty()
    adress : string
    activer:string

    hotel : Types.ObjectId[]
    
}
