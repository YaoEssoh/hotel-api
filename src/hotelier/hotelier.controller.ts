import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Put, NotFoundException } from '@nestjs/common';
import { HotelierService } from './hotelier.service';
import { CreateHotelierDto } from './dto/create-hotelier.dto';
import { UpdateHotelierDto } from './dto/update-hotelier.dto';
import { IHotelier } from './interface/interface.hotelier';

@Controller('hotelier')
export class HotelierController {
  constructor(private readonly hotelierService: HotelierService) {}
   @Post()
   async CreateHotelier(@Res() response, @Body() CreateHotelierDto: CreateHotelierDto) {
       try {
           console.log('Received DTO:', CreateHotelierDto); // Add this line
           const newData = await this.hotelierService.creatNewHotelier(CreateHotelierDto);
           return response.status(200).json({
               message: "Hotelier a été crée avec succès",
               newData
           })
       } catch (error) {
           console.error('Error creating hotelier:', error); // Add this line
           return response.status(400).json({
               message: "Hotelier n'est pas crée " + error
           })         
       }
   }
@Get()
async listHotelier (@Res() response ){
  try {
  const listeData = await this.hotelierService.listHotelier()
  return response.status(200).json({
    message: "Liste des hôteliers récupérée avec succès",
    listeData,
  });

  } catch (error) {
    return response.status(400).json({
      message: "Échec de la récupération des hôteliers"+error
    });
    
  }
  }
  @Delete(":id")
  async deleteHotelier(@Res() response, @Param('id') id: string) {
    try {
      const deleteData = await this.hotelierService.deleteHotelier(id);
      return response.status(200).json({
        message: "Hotelier supprimé avec succès",
        deleteData, // Données de l'hôtelier supprimé
      });
    } catch (error) {
      return response.status(400).json({
        message: "Échec de la suppression de l'hôtelier",
        error: error.message, // Affichage de l'erreur détaillée
      });
      
    }
  }
  @Put(":id")
  async updateHotelier(@Res() response, @Param('id') id:string,@Body()updateHotelierDto:UpdateHotelierDto){
    try {
      const updateHotelier = await this.hotelierService.updateHotelier(id, updateHotelierDto);
      return response.status(200).json({
        message: "Hotelier modifié avec succès",
        updateHotelier,
      });
    } catch (error) {
      return response.status(400).json({
        message: "Échec de la modification de l'hôtelier"+error,
        
      });
      
    }
  }
  @Get(":id")
  async getHotelierById(@Res() response,@Param("id") hotelierId:string){
    try {
      const getOne = await this.hotelierService.getOneHotelier(hotelierId)
      return response.status(200).json({
       message:"hotelier recuperée",getOne
      })
    } catch (error) {
      return response.status(400).json({
        message:"erreur de recuperation de l'hotelier"+ error
      });
      
    }
}
@Put(':id/activer')
async activercompte(@Param('id') id: string): Promise<IHotelier> {
    const hotelier = await this.hotelierService.activer(id);
    if (!hotelier) {
        throw new NotFoundException(`L'hôtelier avec l'ID ${id} n'existe pas.`);
    }
    return hotelier;
}
@Put(':id/desactiver')
async desactivercompte(@Param('id') id: string): Promise<IHotelier> {
    const hotelier = await this.hotelierService.desactiver(id);
    if (!hotelier) {
        throw new NotFoundException(`L'hôtelier avec l'ID ${id} n'existe pas.`);
    }
    return hotelier;
}

}

