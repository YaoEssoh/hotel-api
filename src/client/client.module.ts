import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { utilisateurSchema } from 'src/utilisateur/entities/utilisateur.entity';

@Module({
  imports:[MongooseModule.forFeature([{name:"utilisateur",schema:utilisateurSchema}])],

  controllers: [ClientController],
  providers: [ClientService],
})
export class ClientModule {}
