import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUtilisateurDto } from './dto/create-utilisateur.dto';
import { UpdateUtulisateurDto } from './dto/update-utilisateur.dto';
import { InjectModel } from '@nestjs/mongoose';
import { IUtilsateur } from './interface/interface.utilisateur';
import { Model } from 'mongoose';
import { promises } from 'dns';
import { UpdateMotsDePassDto } from './dto/update-motsdepass.dto';
import * as argon2 from "argon2";

@Injectable()
export class UtilisateurService {
 
constructor (@InjectModel('utilisateur') private utilisateurModel:Model<IUtilsateur> ){}
   async creatNewUtilisateur (CreateUtulisateurDto:CreateUtilisateurDto):Promise <IUtilsateur>{
    const NewUtilisateur=await new this.utilisateurModel(CreateUtulisateurDto)
    return NewUtilisateur.save()  
}
async findUtilisateurByEmail(email:string){
  return this.utilisateurModel.findOne({email})
}
async udapte (id:string,udapteUtilisateurDto:UpdateUtulisateurDto):Promise<IUtilsateur>{
const utilisateur= await this.utilisateurModel.findByIdAndUpdate(id,udapteUtilisateurDto,{new:true})
if(!utilisateur){
  throw new NotFoundException('Utilisateur n est pas defini')
}
return utilisateur
}
async updateToken(id: any, token: string): Promise<any> {
  const utilisateur = await this.utilisateurModel.findByIdAndUpdate(
    id,
    { refreshToken: token }, 
    { new: true } 
  );
  if (!utilisateur) {
    throw new NotFoundException("Utilisateur introuvable !");
  }

  return utilisateur;
}
async findUtilisateurById(id:string){
  const utilisateur=await this.utilisateurModel.findById(id)
  if(!utilisateur){
    throw new NotFoundException("utilisateur n'existe pas")
  }
  return utilisateur
}
async updateMotsDePass (utilisateurId:string,updateMotsDePassDto:UpdateMotsDePassDto):Promise<void>{
  const{ancienMotsDePass,nouveauMotsDePass}=updateMotsDePassDto
  const utilisateur=await this.utilisateurModel.findById(utilisateurId)
  if(!utilisateur){
    throw new NotFoundException("utilisateur n'existe pas")
  }

  const hasheNouveauMotsDePass=await argon2.hash(nouveauMotsDePass)
  await this.utilisateurModel.findByIdAndUpdate(utilisateurId,{motsDePass:hasheNouveauMotsDePass},{new:true})
}
}
