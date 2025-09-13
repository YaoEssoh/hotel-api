/*import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';


async function bootstrap() {
  //const app = await NestFactory.create(AppModule,{cors:true});
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {cors:true});


  // 👉 expose le dossier "uploads" situé à la racine du projet
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/', // Ce prefixe est utilisé dans l'URL
  });
  await app.listen(process.env.PORT ?? 3000);

}
bootstrap();*/
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as express from 'express'; // <-- ajouté

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: true });

  // raw body uniquement pour le webhook Stripe
  app.use('/paiement/webhook', express.raw({ type: 'application/json' }));

  // expose le dossier "uploads"
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

