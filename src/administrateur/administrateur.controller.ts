import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Put } from '@nestjs/common';
import { AdministrateurService } from './administrateur.service';
import { CreateAdministrateurDto } from './dto/create-administrateur.dto';
import { UpdateAdministrateurDto } from './dto/update-administrateur.dto';
import { response } from 'express';

@Controller('administrateur')
export class AdministrateurController {
  constructor(private readonly administrateurService: AdministrateurService) {}
  @Post()
  async CreateAdministrateur(@Res() response,@Body() CreateAdministrateurDto : CreateAdministrateurDto){
    try {
      const newData = await this.administrateurService.createNewAdministrateur( CreateAdministrateurDto)
      return response.status(200).json({
        message: "Administrateur a été  crée avec succès",
        newData
      })
    } catch (error) {
      return response.status(400).json({
        message:" Administrateur n'est pas crée "+error
      })
      
    }
  }
  @Put()
async updateAdministrateur(@Res() response,@Body() updateAdministrateurDto: UpdateAdministrateurDto) {
  try {
    const updatedAdministrateur = await this.administrateurService.updateAdministrateur(updateAdministrateurDto);
    return response.status(200).json({
      message: "Administrateur modifié avec succès",
      updatedAdministrateur,
    });
  } catch (error) {
    return response.status(400).json({
      message: "Échec de la modification de l'Administrateur : " + error.message,
    });
  }
}
@Get(':id')
async getAdministrateurById(@Res() response, @Param('id') administrateurId: string) {
  try {
    const administrateur = await this.administrateurService.getOneAdministrateur(administrateurId);
    return response.status(200).json({
      message: "Administrateur récupéré avec succès",
      administrateur
    });
  } catch (error) {
    return response.status(400).json({
      message: "Échec de la récupération de l'administrateur : " + error.message,
    });
  }
}

  
}
