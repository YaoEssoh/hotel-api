import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Evaluation, EvaluationSchema } from './entites/evaluation.entity';
import { EvaluationService } from './evaluation.service';
import { EvaluationController } from './evaluation.controller';

import { Client, clientSchema } from '../client/entities/client.entity'; // adapter le chemin
import { Hotel, hotelSchema } from '../hotel/entities/hotel.entity';     // adapter le chemin
import { Utilisateur, utilisateurSchema } from 'src/utilisateur/entities/utilisateur.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Evaluation.name, schema: EvaluationSchema },
      { name: 'utilisateur', schema: utilisateurSchema },
      { name: Hotel.name, schema: hotelSchema },
    ]),
  ],
  controllers: [EvaluationController],
  providers: [EvaluationService],
  exports: [EvaluationService],
})
export class EvaluationModule {}
