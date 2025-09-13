import { Module } from '@nestjs/common';
import { HotelierService } from './hotelier.service';
import { HotelierController } from './hotelier.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { utilisateurSchema } from 'src/utilisateur/entities/utilisateur.entity';
import { hotelSchema } from 'src/hotel/entities/hotel.entity';

@Module({
  imports:[MongooseModule.forFeature([{name:"utilisateur",schema:utilisateurSchema},{ name: 'Hotel', schema: hotelSchema }])],
  controllers: [HotelierController],
  providers: [HotelierService],
})
export class HotelierModule {}
