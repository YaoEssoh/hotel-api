import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ChambreService } from './chambre.service';
import { CreateChambreDto } from './dto/create-chambre.dto';
import { UpdateChambreDto } from './dto/update-chambre.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import {diskStorage} from 'multer'
import { extname } from 'path';


@Controller('chambre')
export class ChambreController {
  constructor(private readonly chambreService: ChambreService) {}

 @Post()
 @UseInterceptors(FileInterceptor("file", {
  storage:diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      cb(null , `${new Date().getTime()}${extname(file.originalname)}`)}
  })
}))
 async createChambre(@Res() response, @Body() createChambreDto: CreateChambreDto, @UploadedFile() file) {

  try {
    const imageUrl = file ? file.filename : null;
    createChambreDto.image = imageUrl!;

    const newData = await this.chambreService.createNewChambre(createChambreDto);
    return response.status(200).json({
      message: "La chambre a été ajoutée avec succès",
      newData  
    });  
  } catch (error) {
    return response.status(400).json({
      message: "La chambre n'a pas été créée",
      error: error.message
    });  
  } 
}
@Get()
async listChambre (@Res() response ){
  try {
  const listeData = await this.chambreService.listChambre()
  return response.status(200).json({
    message: "Liste des chambre récupérée avec succès",
    listeData,
  });
  } catch (error) {
    return response.status(400).json({
      message: "Échec de la récupération des chambres"+error
    });
    
  }
  }
  @Delete(':id')
  async deleteChambre(@Res() response, @Param('id') id: string) {
    try {
      const deleteData = await this.chambreService.deleteChambre(id);
      return response.status(200).json({
        message: "Chambre supprimé avec succès",
        deleteData, // Données de la chambre supprimé
      });
    } catch (error) {
      return response.status(400).json({
        message: "Échec de la suppression de la chambre",
        error: error.message, // Affichage de l'erreur détaillée
      });
      
    }
  }

 @Put(':id')
 async updateChambre(@Res() response, @Param('id') id:string,@Body()updateChambreDto:UpdateChambreDto){
  try {
    const updatedChambre = await this.chambreService.updateChambre(id, updateChambreDto);
    return response.status(200).json({
      message: "Chambre modifiée avec succès",
      updatedChambre,
    });
  } catch (error) {
    return response.status(400).json({
      message: "Échec de la modification de la chambre : " + error.message,
    });
  }
   }
  
   @Get(':id')
   async getChambreById(@Res() response,@Param("id") chambreId:string){
     try {
       const getOne = await this.chambreService.getOneChambre(chambreId)
       return response.status(200).json({
        message:"chambre recuperée",getOne
       })
     } catch (error) {
       return response.status(400).json({
         message:"erreur de recuperation de la chambre"+ error
       });
       
     }
 }
}


