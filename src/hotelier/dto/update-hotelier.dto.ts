import { PartialType } from '@nestjs/mapped-types';
import { CreateHotelierDto } from './create-hotelier.dto';

export class UpdateHotelierDto extends PartialType(CreateHotelierDto) {}
