import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReclamationController } from './reclamation.controller';
import { ReclamationService } from './reclamation.service';
import { Reclamation, ReclamationSchema } from './entities/reclamation.entity';
import { Client, clientSchema } from 'src/client/entities/client.entity'; // <-- ajouter import Client
import { Utilisateur, utilisateurSchema } from 'src/utilisateur/entities/utilisateur.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reclamation.name, schema: ReclamationSchema }, { name: 'utilisateur', schema: utilisateurSchema }, ]), ], controllers: [ReclamationController],providers: [ReclamationService],
})
export class ReclamationModule {}

