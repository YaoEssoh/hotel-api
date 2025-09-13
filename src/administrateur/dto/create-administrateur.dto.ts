import { IsNotEmpty, IsString } from "class-validator";
import { CreateUtilisateurDto } from "src/utilisateur/dto/create-utilisateur.dto";

export class CreateAdministrateurDto extends CreateUtilisateurDto {
    role : string
}
