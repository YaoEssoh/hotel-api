import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReclamationDocument = Reclamation & Document;

@Schema({ timestamps: true })
export class ThreadMessage {
  @Prop({ required: true })
  author: string; // peut contenir 'Admin', 'Hotelier' ou un ObjectId string

  @Prop({ required: true })
  message: string;

  @Prop({ type: Date, default: Date.now })
  createdAt?: Date;
}

export const ThreadMessageSchema = SchemaFactory.createForClass(ThreadMessage);

@Schema({ timestamps: true })
export class Reclamation {
  @Prop({ required: true })
  objet: string;

  @Prop({ required: true })
  message: string;

  @Prop({ default: 'open' })
  statut: string;

  // référence optionnelle vers la collection "utilisateur"
  @Prop({ type: Types.ObjectId, ref: 'utilisateur', default: null })
  client?: Types.ObjectId | null;

  // champs de contact pour formulaire public (facultatifs)
  @Prop({ required: false })
  contactName?: string;

  @Prop({ required: false })
  contactEmail?: string;

  // thread : tableau de sous-documents
  @Prop({ type: [ThreadMessageSchema], default: [] })
  thread: ThreadMessage[];

  // createdAt / updatedAt gérés automatiquement par timestamps
}

export const ReclamationSchema = SchemaFactory.createForClass(Reclamation);
