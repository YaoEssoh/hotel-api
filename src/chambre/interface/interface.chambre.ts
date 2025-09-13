import { Types } from "mongoose";
import { Document } from "mongoose";

export interface IChambre extends Document {
  [x: string]: any;
  readonly numero: number;
  readonly capacity: number;
  readonly status: string;
  readonly description: string;
  readonly prixForChild: number;

  readonly equipement: string;
  views: string;
  readonly prix: number;
  readonly disponibilité: boolean;
  readonly image: string;
  reservation: Types.ObjectId[];
  hotel: Types.ObjectId;
}