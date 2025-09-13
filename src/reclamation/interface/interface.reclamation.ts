import { Document, Types } from 'mongoose';

export interface IReclamation extends Document {
  readonly objet: string;
  readonly message: string;
  readonly date: Date;
  readonly statut: string;
  readonly client: Types.ObjectId; // 🔥 un seul client, relation 1-n
}

