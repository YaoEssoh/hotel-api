import { BadGatewayException, BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { InjectModel } from '@nestjs/mongoose';
import { IClient } from './interface/interface.client';
import mongoose, { Model } from 'mongoose';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientService {
 constructor(@InjectModel('utilisateur')private clientModel:Model<IClient>){}
 async createNewClient(CreateClientDto:CreateClientDto):Promise<IClient>{
     const newClient = await new this.clientModel (CreateClientDto)
     return newClient.save()
   }
   async listClient(): Promise<IClient[]> {
           const listeData = await this.clientModel.find({role:"client"}).exec(); 
           return listeData;
         }
    async deleteClient(id: string): Promise<IClient>{
      const clientData = await this.clientModel.findByIdAndDelete(id); // Supprimer l'hôtelier par son ID
              if (!clientData) {
                throw new BadGatewayException('client n est pas defini'); // Gérer l'erreur si l'hôtelier n'est pas trouvé
              }
              return clientData;

    } 
    async updateClient(id :string,updateClientDto:UpdateClientDto): Promise<IClient>{
      const updateClient = await this.clientModel.findByIdAndUpdate(id, updateClientDto,{new:true});
      if (!updateClient){
        throw new BadGatewayException('client n est pas defini')
    
    }
    return updateClient;
    

}
async getOneClient(id:string): Promise<IClient>{
  const getClientById= await this.clientModel.findById(id)
  if(!getClientById){
    throw new BadRequestException("client n'existe pas")
}
return getClientById

}


async getClientsByHotelierId(hotelierId: string): Promise<IClient[]> {
  if (!mongoose.Types.ObjectId.isValid(hotelierId)) {
    throw new BadRequestException("ID hôtelier invalide");
  }

  const clients = await this.clientModel.aggregate([
    // 🔹 Join avec les réservations qui contiennent le client
    {
      $lookup: {
        from: "reservations",
        let: { clientId: "$_id" },
        pipeline: [
          { $match: { $expr: { $in: ["$$clientId", "$client"] } } }
        ],
        as: "reservations"
      }
    },
    { $unwind: "$reservations" },

    // 🔹 Join avec les chambres
    {
      $lookup: {
        from: "chambres",
        localField: "reservations.chambre",
        foreignField: "_id",
        as: "chambre"
      }
    },
    { $unwind: "$chambre" },

    // 🔹 Join avec les hôtels
    {
      $lookup: {
        from: "hotels",
        localField: "chambre.hotel",
        foreignField: "_id",
        as: "hotel"
      }
    },
    { $unwind: "$hotel" },

    // 🔹 Filtrer par hôtelier
    {
      $match: { "hotel.hotelier": new mongoose.Types.ObjectId(hotelierId) }
    },

    // 🔹 Supprimer les champs inutiles
    {
      $project: {
        reservations: 0,
        chambre: 0,
        hotel: 0
      }
    },

    // 🔹 Éviter les doublons
    {
      $group: {
        _id: "$_id",
        doc: { $first: "$$ROOT" }
      }
    },
    { $replaceRoot: { newRoot: "$doc" } }
  ]);

  return clients;
}



}

