import { PartialType } from '@nestjs/mapped-types';
import { CreateReclamationDto} from './create-reclamation.dto';

export class UpdateCreateReclamationDto extends PartialType(CreateReclamationDto) {}