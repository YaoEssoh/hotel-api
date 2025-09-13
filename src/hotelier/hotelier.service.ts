import { BadGatewayException, BadRequestException, Get, Injectable, NotFoundException, Param, Res } from '@nestjs/common';
import { CreateHotelierDto } from './dto/create-hotelier.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import {  IHotelier } from './interface/interface.hotelier';
import { UpdateHotelierDto } from './dto/update-hotelier.dto';
import { IHotel } from 'src/hotel/interface/interface.hotel';
import { IUtilsateur } from 'src/utilisateur/interface/interface.utilisateur';

@Injectable()
export class HotelierService {
    constructor(@InjectModel('utilisateur')private HotelierModel:Model<IHotelier>,
                @InjectModel('Hotel')private readonly hotelModel: Model<IHotel>
  ){}
     async creatNewHotelier(createHotelierDto:CreateHotelierDto):Promise<IHotelier>{
      const newHotelier = new this.HotelierModel(createHotelierDto);
      return newHotelier.save();
    }
       async listHotelier(): Promise<IHotelier[]> {
        const listeData = await this.HotelierModel.find({role:"hotelier"}).exec(); 
        if (listeData.length === 0) {
          throw new NotFoundException('Aucun hôtelier trouvé');
        }
        return listeData;
      }
    
      async deleteHotelier(id: string): Promise<IHotelier> {
        const hotelierData = await this.HotelierModel.findByIdAndDelete(id); // Supprimer l'hôtelier par son ID
        if (!hotelierData) {
          throw new BadGatewayException('hotelier n est pas defini'); // Gérer l'erreur si l'hôtelier n'est pas trouvé
        }
        return hotelierData; // Retourner les données de l'hôtelier supprimé

 
}
async updateHotelier(id :string,updateHotelierDto:UpdateHotelierDto): Promise<IHotelier>{
  const updateHotelier = await this.HotelierModel.findOneAndUpdate({_id:id , role:'hotelier'}, updateHotelierDto,{new:true});
  if (!updateHotelier){
    throw new BadGatewayException('hotelier n est pas defini')

}
return updateHotelier;

}
async getOneHotelier(id:string): Promise<IHotelier>{
  const getHotelierById= await this.HotelierModel.findById(id)
  if(!getHotelierById){
    throw new BadRequestException("formation n'existe pas")
}
return getHotelierById

}
async activer(id: string): Promise<IHotelier> {
  if (!Types.ObjectId.isValid(id)) {
    throw new BadRequestException(`ID invalide : ${id}`);
  }

  // Ajout de logs pour débogage
  console.log(`Tentative d'activation de l'hôtelier ID: ${id}`);

  try {
    const hotelier = await this.HotelierModel.findOneAndUpdate(
      {_id:id , role:"hotelier"},
      { activer: "activé" },
      { new: true, runValidators: true }
    ).exec();

    if (!hotelier) {
      console.log(`Hôtelier non trouvé: ${id}`);
      throw new NotFoundException(`Hôtelier avec l'ID ${id} introuvable`);
    }

    console.log(`Hôtelier ${id} activé avec succès:`, hotelier);
    return hotelier;
  } catch (error) {
    console.error(`Erreur lors de l'activation: ${error.message}`);
    throw error;
  }
}

async desactiver(id: string): Promise<IHotelier> {
  if (!Types.ObjectId.isValid(id)) {
    throw new BadRequestException(`ID invalide : ${id}`);
  }

  console.log(`Tentative de désactivation de l'hôtelier ID: ${id}`);

  try {
    const hotelier = await this.HotelierModel.findOneAndUpdate(
      {_id:id , role:"hotelier"},
      { activer: "désactivé" },
      { new: true, runValidators: true }
    ).exec();

    if (!hotelier) {
      console.log(`Hôtelier non trouvé: ${id}`);
      throw new NotFoundException(`Hôtelier avec l'ID ${id} introuvable`);
    }

    console.log(`Hôtelier ${id} désactivé avec succès:`, hotelier);
    return hotelier;
  } catch (error) {
    console.error(`Erreur lors de la désactivation: ${error.message}`);
    throw error;
  }
}
}

