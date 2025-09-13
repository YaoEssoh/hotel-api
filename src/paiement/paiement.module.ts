import { Module } from '@nestjs/common';
import { PaiementService } from './paiement.service';
import { PaiementController } from './paiement.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { paiementSchema } from './entities/paiement.entity';

@Module({
  imports: [
      MongooseModule.forFeature([{ name: 'Paiement', schema: paiementSchema  }, { name: 'Reservation', schema: paiementSchema  }]) // 🔥 Ajout du modèle
    ],
  controllers: [PaiementController],
  providers: [PaiementService],
})
export class PaiementModule {}
