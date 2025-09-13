import { Module } from '@nestjs/common';
import { AdministrateurService } from './administrateur.service';
import { AdministrateurController } from './administrateur.controller';
import { administrateurSchema } from './entities/administrateur.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { utilisateurSchema } from 'src/utilisateur/entities/utilisateur.entity';

@Module({
  imports:[MongooseModule.forFeature([{name:"utilisateur",schema:utilisateurSchema}])],

  controllers: [AdministrateurController],
  providers: [AdministrateurService],
})
export class AdministrateurModule {}
