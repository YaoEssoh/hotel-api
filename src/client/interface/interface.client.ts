import { Types } from "mongoose";
import { IUtilsateur } from "src/utilisateur/interface/interface.utilisateur"

export interface IClient extends IUtilsateur {
    readonly 
    profil : string
    role : string
    reservation: Types.ObjectId;
    reclamation: Types.ObjectId[]
    evaluation: string[]; 

    
}
