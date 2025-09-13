import { PartialType } from '@nestjs/mapped-types';
import { CreateUtilisateurDto } from './create-utilisateur.dto';

export class UpdateUtulisateurDto extends PartialType(CreateUtilisateurDto) {}
