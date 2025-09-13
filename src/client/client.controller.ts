import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Put, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import {diskStorage} from "multer"
import { extname } from 'path';
@Controller('client')
export class ClientController {
   constructor(private readonly ClientService: ClientService) {}
   @UseInterceptors(FileInterceptor("file", {
    storage:diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        cb(null , `${new Date().getTime()}${extname(file.originalname)}`)}
    })
  }))
  @Post()
    async CreateClient(@Res() response,@Body() CreateClientDto : CreateClientDto,@UploadedFile() file){
        try {
          CreateClientDto.profil = file ? file.filename : null ;
            const newData = await this.ClientService.createNewClient(CreateClientDto)
            return response.status(200).json({
                message: "Client a été  crée avec succès",
                newData
              })
        } catch (error) {
            return response.status(400).json({
             message:" client n'est pas crée "+error
             })         
            
        }
    }
 @Get()
async listClient (@Res() response ){
  try {
  const listeData = await this.ClientService.listClient()
  return response.status(200).json({
    message: "Liste des clients récupérée avec succès",
    listeData,
  });
  } catch (error) {
    return response.status(400).json({
      message: "Échec de la récupération de la liste des clients "+error
    });
    
  }
  }
 @Delete(':id') 
 async deleteClient(@Res() response, @Param('id') id: string) {
   try {
    const deleteData = await this.ClientService.deleteClient(id);
      return response.status(200).json({
        message: "client supprimé avec succès",
        deleteData, // Données de l'hôtelier supprimé
      });
   } catch (error) {
    return response.status(400).json({
        message: "Échec de la suppression de l'hôtelier",
        error: error.message, // Affichage de l'erreur détaillée
      });
   } 
 }
 @Put(':id')
async updateClient(@Res() response, @Param('id') id:string,@Body()updateClientDto:UpdateClientDto){
   try {
    const updateClient = await this.ClientService.updateClient(id, updateClientDto);
      return response.status(200).json({
        message: "Client modifié avec succès",
        updateClient,
      });
   } catch (error) {
    return response.status(400).json({
        message: "Échec de la modification du client",
        error: error.message, // Affichage de l'erreur détaillée
      });

   } 
}
@Get(":id")
async getClientById(@Res() response,@Param("id") clientId:string){
  try {
    const getOne = await this.ClientService.getOneClient(clientId)
    return response.status(200).json({
     message:"client recuperée",getOne
    })
  } catch (error) {
    return response.status(400).json({
      message:"erreur de recuperation du client"+ error
    });
    
  }
}
@Get("by-hotelier/:hotelierId")
async getClientsByHotelierId(
  @Res() response,
  @Param("hotelierId") hotelierId: string
) {
  try {
    const clients = await this.ClientService.getClientsByHotelierId(hotelierId);
    return response.status(200).json({
      message: "Clients récupérés avec succès",
      clients
    });
  } catch (error) {
    return response.status(400).json({
      message: "Erreur lors de la récupération des clients",
      error: error.message
    });
  }
}

}
