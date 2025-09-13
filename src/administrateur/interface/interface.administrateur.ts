import { Utilisateur } from "src/utilisateur/entities/utilisateur.entity";
import { IUtilsateur } from "src/utilisateur/interface/interface.utilisateur";

export interface IAdministrateur extends IUtilsateur{
    role : string
}