import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Double, Types } from "mongoose";

export class CreateChambreDto {
  @IsString()
  @IsNotEmpty()
  numero: number;
  @IsString()
  @IsNotEmpty()
  views: string;
  @IsString()
  @IsNotEmpty()
  status: string;
  @IsString()
  @IsNotEmpty()
  description: string;
  @IsString()
  @IsNotEmpty()
  equipement: string;
  image: string;
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  prix: number;
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  prixForChild: number;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  capacite: number;

  disponibilité: boolean;
  reservation: Types.ObjectId[];
  hotel: Types.ObjectId;
}
