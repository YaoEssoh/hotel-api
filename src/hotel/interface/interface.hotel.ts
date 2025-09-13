import { Types } from "mongoose"
import { Document } from "mongoose"
export interface IHotel extends Document {
  readonly nom: string;
  readonly description: string;
  readonly adress: string;
  readonly nombreEtoiles: string;
  readonly telephone: number;
  readonly email: string;
  readonly nombreChambres: number;
  // readonly listeChambresDispo: number;
  readonly service: string;
  // readonly reservations: string;
   readonly tarifMoyen: string;
  readonly images: string[];
  chambre: Types.ObjectId[];
  hotelier: Types.ObjectId;
  evaluation: string[]; 

}