import { Module } from '@nestjs/common';
import { UtilisateurController } from './utilisateur.controller';
import { UtilisateurService } from './utilisateur.service';
import { MongooseModule } from '@nestjs/mongoose';
import { utilisateurSchema } from './entities/utilisateur.entity';
import { clientSchema } from 'src/client/entities/client.entity';
import { hotelierSchema } from 'src/hotelier/entities/hotelier.entity';
import { administrateurSchema } from 'src/administrateur/entities/administrateur.entity';

@Module({
  imports:[MongooseModule.forFeature([{name:'utilisateur',schema:utilisateurSchema,discriminators:[{name:"client",schema:clientSchema},{name:"hotelier",schema:hotelierSchema} ,{name:"administrateur",schema:administrateurSchema}]}])],
  controllers: [UtilisateurController],
  providers: [UtilisateurService],
  exports:[UtilisateurService]
})
export class UtilisateurModule {}
