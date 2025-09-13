import { IsNotEmpty, IsString } from "class-validator";
import { Types } from "mongoose";
import { CreateUtilisateurDto } from "src/utilisateur/dto/create-utilisateur.dto";

export class CreateClientDto extends CreateUtilisateurDto {
   @IsString()
   @IsNotEmpty()
   profil : string
   role : string  
   reservation: Types.ObjectId;
   reclamation : Types.ObjectId[];

            
   
}
