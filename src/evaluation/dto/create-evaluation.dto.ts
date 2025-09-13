import { IsNotEmpty, IsMongoId, IsString, IsNumber } from "class-validator";
import { Types } from "mongoose";

export class CreateEvaluationDto {
  @IsNumber()
  @IsNotEmpty()
  note: number;

  @IsString()
  @IsNotEmpty()
  commentaire: string;

  @IsString()
  @IsNotEmpty()
  date: string;

  @IsMongoId({ message: 'Client ID invalide' })
  client: Types.ObjectId;

  @IsMongoId({ message: 'Hotel ID invalide' })
  hotel: Types.ObjectId;
}
