import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Put, HttpStatus } from '@nestjs/common';
import { UtilisateurService } from './utilisateur.service';
import { CreateUtilisateurDto } from './dto/create-utilisateur.dto';
import { UpdateUtulisateurDto } from './dto/update-utilisateur.dto';
import { response } from 'express';
import { UpdateMotsDePassDto } from './dto/update-motsdepass.dto';


@Controller('utulisateur')
export class UtilisateurController {
  constructor(private readonly utilisateurService: UtilisateurService) {}

  @Put('update-motsdepass/:id')
  async updateMotsDePas(@Res() response,@Param('id') id:string,@Body() updateMotsDePassDto:UpdateMotsDePassDto){
    try {
      await this.utilisateurService.updateMotsDePass(id, updateMotsDePassDto);
      return response.status(HttpStatus.NO_CONTENT).send()
    } catch (error) {
     return response.status(HttpStatus.NO_CONTENT).json({
      statusCode:400,
      message: 'error: Utilisateur mots de passe n est pas mise a jour',
      error: error.message||error.toString(),
     });  
    }
  }
}
