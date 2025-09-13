/*import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UtilisateurModule } from './utilisateur/utilisateur.module';
import { AdministrateurModule } from './administrateur/administrateur.module';
import { ClientModule } from './client/client.module';
import { HotelierModule } from './hotelier/hotelier.module';
import { ChatbotModule } from './chatbot/chatbot.module';
import { ReservationModule } from './reservation/reservation.module';
import { ChambreModule } from './chambre/chambre.module';
import { HotelModule } from './hotel/hotel.module';
import { PaiementModule } from './paiement/paiement.module';
import { ReclamationModule } from './reclamation/reclamation.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { Evaluation } from './evaluation/entites/evaluation.entity';
import { EvaluationModule } from './evaluation/evaluation.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://127.0.0.1:27017',{dbName:"hotel"}), UtilisateurModule, AdministrateurModule, ClientModule, HotelierModule, ChatbotModule, ReservationModule, ChambreModule, HotelModule, PaiementModule, AuthModule,ReclamationModule,EvaluationModule, ConfigModule.forRoot({isGlobal:true}),
     ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'public'), // Chemin vers le dossier public
  }),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}*/

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UtilisateurModule } from './utilisateur/utilisateur.module';
import { AdministrateurModule } from './administrateur/administrateur.module';
import { ClientModule } from './client/client.module';
import { HotelierModule } from './hotelier/hotelier.module';
import { ChatbotModule } from './chatbot/chatbot.module';
import { ReservationModule } from './reservation/reservation.module';
import { ChambreModule } from './chambre/chambre.module';
import { HotelModule } from './hotel/hotel.module';
import { PaiementModule } from './paiement/paiement.module';
import { ReclamationModule } from './reclamation/reclamation.module';
import { AuthModule } from './auth/auth.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { EvaluationModule } from './evaluation/evaluation.module';
import { ConfigModule, ConfigService } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    //MongooseModule.forRoot(process.env.MONGO_URI!),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
    }),
    UtilisateurModule,
    AdministrateurModule,
    ClientModule,
    HotelierModule,
    ChatbotModule,
    ReservationModule,
    ChambreModule,
    HotelModule,
    PaiementModule,
    AuthModule,
    ReclamationModule,
    EvaluationModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

