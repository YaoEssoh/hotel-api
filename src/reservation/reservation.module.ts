import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { reservationSchema } from './entities/reservation.entity';
import { chambreSchema } from 'src/chambre/entities/chambre.entity';

@Module({
   imports: [
      MongooseModule.forFeature([{ name: 'Reservation', schema: reservationSchema} , {name: 'Chambre', schema:chambreSchema} , {name: 'Client', schema:chambreSchema}]) // 🔥 Ajout du modèle
    ],
  controllers: [ReservationController],
  providers: [ReservationService],
})
export class ReservationModule {}
