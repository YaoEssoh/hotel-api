import { IsNotEmpty, IsString } from "class-validator";

export class CreateUtilisateurDto {
   
    @IsString()
    @IsNotEmpty()
    nom : string
    @IsString()
    @IsNotEmpty()
    prenom : string
    @IsString()
    @IsNotEmpty()
    numero : number
    @IsString()
    @IsNotEmpty()
    email : string
    @IsString()
    @IsNotEmpty()
    motsDePass : string
    refreshToken: string

    
    
}
