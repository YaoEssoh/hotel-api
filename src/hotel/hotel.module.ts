import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HotelService } from './hotel.service';
import { HotelController } from './hotel.controller';
import { Hotel, hotelSchema } from './entities/hotel.entity';
import { hotelierSchema } from 'src/hotelier/entities/hotelier.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Hotel', schema: hotelSchema }, {name:"utilisateur",schema:hotelierSchema}]) // 🔥 Ajout du modèle
  ],
  controllers: [HotelController],
  providers: [HotelService],
})
export class HotelModule {}

