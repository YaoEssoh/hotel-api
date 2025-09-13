import { Types } from "mongoose";

export interface IHotelier  {
    role : string
    readonly adress : string
    activer:string

    hotel : Types.ObjectId[]
    
}
