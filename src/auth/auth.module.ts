import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UtilisateurModule } from 'src/utilisateur/utilisateur.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports:[JwtModule.register({}),UtilisateurModule ,
    MailerModule.forRoot({
      transport:{
        host:"sandbox.smtp.mailtrap.io",
        port: 2525,
        auth:{
          user:"bb6c9fa07a0693",
          pass:"a7b43c2ce13790"
        }
      }
    })
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
