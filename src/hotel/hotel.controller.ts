import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Put, UseInterceptors, UploadedFiles, UploadedFile } from '@nestjs/common';
import { HotelService } from './hotel.service';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { response } from 'express';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {diskStorage} from 'multer'
import { extname } from 'path';

@Controller('hotel')
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  @Post()
  @UseInterceptors(FilesInterceptor("files",10, {
    storage:diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        cb(null , `${new Date().getTime()}${extname(file.originalname)}`)}
    })
  }))
  async createHotel(@Res() response,@Body() CreateHotelDto : CreateHotelDto,@UploadedFiles() files) {
    try {
      CreateHotelDto.images =  files ? files.map(file => file.filename) : []; 
      const newData = await this.hotelService.createNewHotel(CreateHotelDto);
      return response.status(200).json({
        message: "l'Hotel a été  ajouté avec succès",
        newData  
      })  
    } catch (error) {
      return response.status(400).json({
        message:" l'Hotel n'est pas crée "+error
        })  
      
    }
  
}

 @Get('statistiques')
  async getStats(/*@Param('hotelierId') hotelierId: string,*/ @Res() res) {
    try {
      const stats = await this.hotelService.getStats(/*hotelierId*/);
      console.log(stats);
      
      return res.status(200).json({
        message: 'Statistiques récupérées avec succès',
        stats,
      });
    } catch (error) {
      return res.status(400).json({
        message: `Erreur lors de la récupération des statistiques: ${error.message}`,
      });
    }
  }

@Get()
async listHotel (@Res() response ){
  try {
  const listeData = await this.hotelService.listHotel()
  return response.status(200).json({
    message: "Liste des hôtels récupérée avec succès",
    listeData,
  });
  } catch (error) {
    return response.status(400).json({
      message: "Échec de la récupération des hôtels"+error
    });
    
  }
}

  @Delete(':id')
  async deleteHotel(@Res() response, @Param('id') id: string) {
    try {
      const deleteData = await this.hotelService.deleteHotel(id);
      return response.status(200).json({
        message: "Hotel supprimé avec succès",
        deleteData, // Données de l'hôtelier supprimé
      });
    } catch (error) {
      return response.status(400).json({
        message: "Échec de la suppression de l'hôtel",
        error: error.message, // Affichage de l'erreur détaillée
      });
      
    }
  }
@Put(':id')
async updateHotel(@Res() response, @Param('id') id:string,@Body()updateHotelDto:UpdateHotelDto){
    try {
      const updateHotel = await this.hotelService.updateHotel(id, updateHotelDto);
      return response.status(200).json({
        message: "hôtel modifié avec succès",
        updateHotel,
      });
    } catch (error) {
      return response.status(400).json({
        message: "Échec de la modification de l'hôtel"+error,
        
      });
      
    }
  }
  @Get(':id')
  async getHotelById(@Res() response,@Param("id") hotelId:string){
    try {
      const getOne = await this.hotelService.getOneHotel(hotelId)
      return response.status(200).json({
       message:"hôtel recuperée",getOne
      })
    } catch (error) {
      return response.status(400).json({
        message:"erreur de recuperation de l'hôtel"+ error
      });
      
    }
    
}
@Get('etoiles/:nombre')
async getHotelsParEtoiles(@Param('nombre') nombre: number) {
  return this.hotelService.findByNombreEtoiles(Number(nombre));
}


}


