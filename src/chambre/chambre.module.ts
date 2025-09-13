import { Module } from '@nestjs/common';
import { ChambreService } from './chambre.service';
import { ChambreController } from './chambre.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Chambre, chambreSchema } from './entities/chambre.entity';

@Module({
  imports : [
           MongooseModule.forFeature([{ name: 'chambre', schema: chambreSchema }, { name: 'Hotel', schema: chambreSchema }]) // 🔥 Ajout du modèle
       
  ],
  controllers: [ChambreController],
  providers: [ChambreService],  
})
export class ChambreModule {}
