import { BadGatewayException, BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateChambreDto } from './dto/create-chambre.dto';
import { UpdateChambreDto } from './dto/update-chambre.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Chambre } from './entities/chambre.entity';
import mongoose, { Model } from 'mongoose';
import { IChambre } from './interface/interface.chambre';
import { IHotel } from 'src/hotel/interface/interface.hotel';

@Injectable()
export class ChambreService {
   constructor( @InjectModel("chambre") private readonly chambreModel: Model<IChambre>, 
   @InjectModel('Hotel') private readonly hotelModel: Model<IHotel>,

  ) {}
  async createNewChambre(createChambreDto: CreateChambreDto): Promise<IChambre> {
    const newChambre = new this.chambreModel(createChambreDto);
    const savedChambre = await newChambre.save() as IChambre;

    const hotelId = await this.hotelModel.findById(createChambreDto.hotel);

    if (!hotelId) {
      console.log("Hôtel non trouvé !");
      throw new Error("L'hôtel spécifié n'existe pas");
  }

  // 🔥 Initialisation du tableau `chambres` si nécessaire
  if (!hotelId.chambre) {
      hotelId.chambre = [];
  }

  // 🔥 Ajout de la chambre à la liste des chambres de l'hôtel
  hotelId.chambre.push(savedChambre._id as mongoose.Types.ObjectId);
  const savedHotel = await hotelId.save();
  console.log("Hôtel mis à jour :", savedHotel);

  return savedChambre;
}
  async listChambre(): Promise<IChambre[]> {
           const listeData = await this.chambreModel.find().exec(); 
           
           return listeData;
         }
 async deleteChambre(id: string): Promise<IChambre> {
          // Supprimer la chambre par son ID
          const deleteChambre = await this.chambreModel.findByIdAndDelete(id);
      
          if (!deleteChambre) {
              throw new BadGatewayException(`Chambre #${id} n'est pas définie`); // Gérer l'erreur si la chambre n'est pas trouvée
          }
      
          // Mise à jour de l'hôtel associé
          const updateHotel = await this.hotelModel.findById(deleteChambre.hotel);
          
          if (updateHotel) {
              // Filtrer les chambres pour supprimer celle qui a été supprimée
              updateHotel.chambre = updateHotel.chambre.filter(
                  (chambreId) => chambreId.toString() !== id
              );
      
              await updateHotel.save();
          } else {
              throw new NotFoundException(`Hôtel associé à la chambre #${id} n'est pas défini`);
          }
      
          return deleteChambre;
      }
      
 async updateChambre(id :string,updateChambreDto:UpdateChambreDto): Promise<IChambre>{
    const updateChambre = await this.chambreModel.findByIdAndUpdate(id, updateChambreDto,{new:true});
    if (!updateChambre){
      throw new BadGatewayException('chambre n est pas defini')
  
  }
  return updateChambre;
}

async getOneChambre(id:string): Promise<IChambre>{
  const getChambreById= await this.chambreModel.findById(id)
  if(!getChambreById){
    throw new BadRequestException("chambre n'existe pas")
}
return getChambreById

}
}
