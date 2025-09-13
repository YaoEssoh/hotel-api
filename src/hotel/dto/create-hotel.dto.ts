import { IsNotEmpty, IsString, IsNumber, IsEmail, IsArray } from "class-validator";
import { Types } from "mongoose";

export class CreateHotelDto {
  @IsString()
  @IsNotEmpty()
  nom: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  adress: string;

  @IsNumber()
  @IsNotEmpty()
  nombreEtoiles: number;

  @IsNumber()
  @IsNotEmpty()
  telephone: number;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNumber()
  @IsNotEmpty()
  nombreDeChambre: number;

  @IsString()
  @IsNotEmpty()
  service: string;

  @IsNumber()
  @IsNotEmpty()
  tarifMoyen: number;

  @IsArray()
  @IsString({ each: true })
  images: string[];

  @IsArray()
  chambre: Types.ObjectId[];

  // Si tu choisis de stocker l'ID des évaluations dans l’hôtel (option 1)
  // @IsArray()
  // evaluation: Types.ObjectId[];

  @IsNotEmpty()
  hotelier: Types.ObjectId;
}
