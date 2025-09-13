import { Document } from "mongoose";
export interface IUtilsateur extends Document{
    readonly nom: string
    readonly prenom: string
    readonly numero: number
    readonly email: string
    readonly motsDePass: string
    refreshToken: string
    

}