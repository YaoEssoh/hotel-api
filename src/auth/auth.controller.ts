import { Controller, Get, Post, Body, Res, Query, Param, Req, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { AuthService } from './auth.service';
import { Request } from 'express';


@Controller('auth')
export class AuthController {
  
  constructor(private readonly authService: AuthService) {}
  @Post('signin')
  
  async signAuth(@Res() response, @Body() authDO: CreateAuthDto): Promise<any>{
      try {
        const newData = await this.authService.signIn(authDO);
        return response.status(200).json({
          message: "Authentification réussie",
          data: newData
        })

    }
    catch (error) {
      return response.status(400).json({
        message: "Échec de l'authentification"+error
        
      }) 
    }
  }
  @Get()
  async signAuthGet(@Res()response, @Query('email') email: string,@Query('motsDePass') motsDePass: string, authDO: CreateAuthDto): Promise<any>{

    try {
      
      const newData = await this.authService.signIn(authDO);
      return response.status(200).json({
        message: "Authentification réussie ",
        data:newData
      })
      
    } catch (error) {
      return response.status(400).json({
        message:"Échec de l'authentification"+error
        
      })
      
    }

  }
  @Post('forget')
  async forgetsMotsDePass(@Res() response, @Body('email') email: string): Promise<any>{
    try {
      const newData = await this.authService.forgetMotsDePass(email);
      return response.status(200).json({
        message: "E-mail de réinitialisation envoyé avec succès",
        data: newData
      });

    } catch (error) {
      return response.status(400).json({
        message: "Erreur lors de la récupération du mot de passe : " + error.message
      });
      
    }
  }
  @Post('resetMotsDePass/:token')
  
  async resetMotPass(@Param('token')token:string,@Body('newMotsDePass') newMotsDePass: string){
    return this.authService.resetMotsDePass(token,newMotsDePass)
  }
  @Get('deconnexion')
  deconnexion(@Req() req:Request){
    if(!req.user){
      throw new UnauthorizedException ('Utilisateur non authentifié')
    }
    return this.authService.deconnexion(req.user['sub'])
  }
 
}