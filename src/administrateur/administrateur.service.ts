import { BadGatewayException, BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAdministrateurDto } from './dto/create-administrateur.dto';
import { InjectModel } from '@nestjs/mongoose';
import { IAdministrateur } from './interface/interface.administrateur';
import { Model } from 'mongoose';
import { UpdateAdministrateurDto } from './dto/update-administrateur.dto';
import { error } from 'console';
import { Administrateur } from './entities/administrateur.entity';

@Injectable()
export class AdministrateurService {
  constructor(@InjectModel('utilisateur')private administrateurModel:Model<IAdministrateur>){}
  async createNewAdministrateur(CreateAdministrateurDto:CreateAdministrateurDto):Promise<IAdministrateur>{
    const esxisteAdministrateur = await this.administrateurModel.findOne({role:"administrateur"})
    if(esxisteAdministrateur){
      throw new Error ('il ne peut pas ajouter un administrateur')
    }
    const newAdministrateur=await new this.administrateurModel({...CreateAdministrateurDto,role:"administrateur"})
    return newAdministrateur.save()

  }

  async updateAdministrateur(updateAdministrateurDto: UpdateAdministrateurDto): Promise<IAdministrateur> {
    const updatedAdministrateur = await this.administrateurModel.findOneAndUpdate(
      {}, // Recherche le premier administrateur trouvé
      updateAdministrateurDto,
      { new: true }
    );
  
    if (!updatedAdministrateur) {
      throw new BadGatewayException("Aucun administrateur trouvé");
    }
  
    return updatedAdministrateur;
  }
  async getOneAdministrateur(id: string): Promise<IAdministrateur> {
    const administrateur = await this.administrateurModel.findById(id);
  
    if (!administrateur) {
      throw new NotFoundException("Administrateur non trouvé");
    }
  
    return administrateur;
  }
  
  

}
