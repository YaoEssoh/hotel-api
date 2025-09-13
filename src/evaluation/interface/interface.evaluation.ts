import { Document, Types } from 'mongoose';

export interface IEvaluation extends Document {
  readonly note: string;
  readonly commentaire: string;
  readonly date: Date;
  readonly client: Types.ObjectId; // 🔥 un seul client, relation 1-n
  readonly hotel: Types.ObjectId;
}