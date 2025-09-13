import { IsNotEmpty, IsMongoId, IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ThreadMessageDto {
  @IsString()
  @IsNotEmpty()
  author: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsOptional()
  createdAt?: Date;
}

export class CreateReclamationDto {
  @IsString()
  @IsNotEmpty()
  objet: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsOptional()
  statut?: string;

  // client est optionnel (formulaire public)
  @IsMongoId()
  @IsOptional()
  client?: string;

  // champs de contact facultatifs pour formulaire public
  @IsString()
  @IsOptional()
  contactName?: string;

  @IsString()
  @IsOptional()
  contactEmail?: string;

  // thread optionnel
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ThreadMessageDto)
  thread?: ThreadMessageDto[];
}
