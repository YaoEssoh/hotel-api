import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException, Options, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UtilisateurService } from 'src/utilisateur/utilisateur.service';
import * as argon2 from "argon2";
import { MailerService } from '@nestjs-modules/mailer';


@Injectable()
export class AuthService {
 
  constructor(private jwtService:JwtService, private configService: ConfigService,  private utilisateurservice: UtilisateurService, private mailerService: MailerService){}
  async signIn(data: CreateAuthDto){
    const utilisateur= await this.utilisateurservice.findUtilisateurByEmail(data.email)
    if(!utilisateur){
      throw new NotFoundException('Ce Utilisateur avec cette email ${data.email} n existe pas')
    }
    const verifyMotsDePass= await argon2.verify(utilisateur.motsDePass,data.motsDePass)
    if(!verifyMotsDePass){
      throw new BadRequestException('Mots de pass incorect')
    }
   const tokens=await this.getTokens(utilisateur.id,utilisateur.nom)
    await this.udapteRefreshToken(utilisateur.id,tokens.refreshToken)
    return{tokens,utilisateur}
  }
  async getTokens(utilisateurId:string, nomUtilisateur: string){
    const[accessToken,refreshToken]=await Promise.all([
      this.jwtService.signAsync(
        {sub:utilisateurId,nomUtilisateur},
        {secret:this.configService.get<string>('JWT_ACCESS_SECRET'),expiresIn:'15min'}
      ),
      this.jwtService.signAsync(
        {sub:utilisateurId,nomUtilisateur},
        {secret:this.configService.get<string>('JWT_refresh_SECRET'),expiresIn:'7d'}
      )
    ])
    return {accessToken,refreshToken}
  }
  async udapteRefreshToken(utilisateurId:any,refreshToken: string){
    const hashedRefreshToken=await argon2.hash(refreshToken)
    this.utilisateurservice.udapte(utilisateurId, {refreshToken:hashedRefreshToken})
    
  }
async forgetMotsDePass(email: string) {
  try {
    // 🔹 On récupère l'utilisateur (peut être client ou hôtelier)
    const utilisateur = await this.utilisateurservice.findUtilisateurByEmail(email);

    if (!utilisateur) {
      throw new NotFoundException("L'utilisateur n'existe pas");
    }

    // 🔹 Création du token JWT temporaire (5 min)
    const token = await this.jwtService.sign(
      { id: utilisateur._id },
      {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: "5m"
      }
    );

    // 🔹 On enregistre le token pour vérification ultérieure
    await this.utilisateurservice.updateToken(utilisateur._id, token);

    // 🔹 Déterminer le port selon le type
    let baseUrl: string;

    // On teste si c'est un client
    /*if ('role' in utilisateur && utilisateur.role === 'client') {
      baseUrl = 'https://hotel-client-24h6.onrender.com'; // Front client
    } else {
      baseUrl = 'https://hotelier-fbzq.onrender.com'; // Front hôtelier
    }*/

    if ('role' in utilisateur && utilisateur.role === 'client') {
      baseUrl = this.configService.get<string>('CLIENT_URL')!;
    } else {
      baseUrl = this.configService.get<string>('HOTELIER_URL')!;
    }


    // 🔹 Préparation et envoi du mail
    const options = {
    to: utilisateur.email,
    subject: 'Réinitialisation du mot de passe',
    html: `
      <h1>Vous pouvez réinitialiser votre mot de passe</h1>
      <a href="${baseUrl}/reset-password/${token}">Cliquez ici</a>
    `
  };


    await this.mailerService.sendMail(options);

    return {
      success: true,
      message: "Vous pouvez modifier votre mot de passe",
      data: utilisateur
    };

  } catch (error) {
    return {
      success: false,
      message: "Erreur lors de l'envoi du mail : " + error.message
    };
  }
}

 async resetMotsDePass(token: string, newMotsDePass: string) {
  try {
    // Vérification plus robuste du token
    if (!token) {
      throw new BadRequestException('Token is required');
    }

    // Vérifier le token JWT
    const verifyToken = await this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
    }).catch(() => {
      throw new UnauthorizedException('Token invalide ou expiré');
    });

    // Validation du nouveau mot de passe
    if (!newMotsDePass || typeof newMotsDePass !== 'string') {
      throw new BadRequestException('Le nouveau mot de passe est requis');
    }

    // Trouver l'utilisateur par ID
    const utilisateur = await this.utilisateurservice.findUtilisateurById(verifyToken.id);
    if (!utilisateur) {
      throw new NotFoundException("Utilisateur non trouvé");
    }

    // Hacher le nouveau mot de passe
    const hasheNewMotsDePass = await argon2.hash(newMotsDePass);

    // Mettre à jour le mot de passe de l'utilisateur
    await this.utilisateurservice.udapte(utilisateur.id, {
      motsDePass: hasheNewMotsDePass,
      refreshToken: undefined, // Mieux que undefined pour la base de données
    });

    return { 
      success: true, 
      message: 'Mot de passe réinitialisé avec succès',
      userId: utilisateur.id 
    };
  } catch (error) {
    console.error('Erreur lors de la réinitialisation:', error);
    throw new HttpException(
      error.response?.message || 'Erreur lors de la réinitialisation',
      error.status || HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}
  
  async deconnexion(utilisateurId:string){
    return this.utilisateurservice.udapte(utilisateurId,{refreshToken:undefined})
  }
  
}
  

