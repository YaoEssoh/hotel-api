//reservation.controller.ts
/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Put } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  async createReservation(
    @Res() response,
    @Body() createReservationDto: CreateReservationDto,
  ) {
    try {
      const newData =
        await this.reservationService.createNewReservation(
          createReservationDto,
        );
      return response.status(201).json({
        message: 'La réservation a été ajoutée avec succès',
        newData,
      });
    } catch (error) {
      return response.status(400).json({
        message: "La réservation n'a pas été créée" + error,
      });
    }
  }
  @Post('check-availability')
  async checkAvailability(
    @Body() body: { roomId: string; checkIn: string; checkOut: string },
  ) {
    const isAvailable = await this.reservationService.isRoomAvailable(
      body.roomId,
      new Date(body.checkIn),
      new Date(body.checkOut),
    );

    return { isAvailable };
  }
  @Get()
  async listReservation(@Res() response) {
    try {
      const listeData = await this.reservationService.listReservation();
      return response.status(200).json({
        message: 'Liste des reservation récupérée avec succès',
        listeData,
      });
    } catch (error) {
      return response.status(400).json({
        message: 'Échec de la récupération des reservation' + error,
      });
    }
  }

  /* @Get('/statics')
  async getStats(@Param('hotelierId') hotelierId: string @Res() response) {
    return this.reservationService.getStats(/*hotelierId);
  }*/

// 📌 Controller
@Get('statics')
async getStats(/*@Param('hotelierId') hotelierId: string*/ @Res() response) {
  try {
    const stats = await this.reservationService.getStats(/*hotelierId*/);
    return response.status(200).json({
      message: 'Statistiques récupérées avec succès',
      stats,
    });
  } catch (error) {
    return response.status(400).json({
      message: `Erreur lors de la récupération des statistiques: ${error.message}`,
    });
  }
}

@Get('client/:clientId')
async getReservationsByClientId(
  @Param('clientId') clientId: string,
  @Res() res,
) {
  try {
    const reservations = await this.reservationService.getReservationsByClientId(clientId);
    return res.status(200).json({
      message: 'Réservations du client récupérées avec succès',
      data: reservations,
    });
  } catch (error) {
    return res.status(400).json({
      message: 'Erreur lors de la récupération des réservations du client',
      error: error.message,
    });
  }
}

  @Delete(':id')
  async deleteReservation(@Res() response, @Param('id') id: string) {
    try {
      const deleteData = await this.reservationService.deleteReservation(id);
      return response.status(200).json({
        message: 'reservation  annulée avec succès',
        deleteData, // Données de l'hôtelier supprimé
      });
    } catch (error) {
      return response.status(400).json({
        message: "Échec de l'annultion de la reservation",
        error: error.message, // Affichage de l'erreur détaillée
      });
    }
  }
  @Put(':id')
  async updateReservation(
    @Res() response,
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    try {
      const updateReservation = await this.reservationService.updateReservation(
        id,
        updateReservationDto,
      );
      return response.status(200).json({
        message: 'Reservation modifiée avec succès',
        updateReservation,
      });
    } catch (error) {
      return response.status(400).json({
        message: 'Échec de la modification de la reservation' + error,
      });
    }
  }
  @Get(':id')
  async getReservationById(@Res() response, @Param('id') hotelId: string) {
    try {
      const getOne = await this.reservationService.getOneReservation(hotelId);
      return response.status(200).json({
        message: 'reservation recuperée',
        getOne,
      });
    } catch (error) {
      return response.status(400).json({
        message: 'erreur de recuperation de la reservation' + error,
      });
    }
  }

  @Patch(':id/statut')
  async updateReservationStatus(
    @Res() response,
    @Param('id') id: string,
    @Body() body: { statut: 'Pending' | 'Confirmed' | 'Cancelled' },
  ) {
    try {
      const updated = await this.reservationService.updateReservationStatus(id, body.statut);
      return response.status(200).json({
        message: 'Statut de la réservation mis à jour avec succès',
        updated,
      });
    } catch (error) {
      return response.status(400).json({
        message: 'Échec de la mise à jour du statut',
        error: error.message,
      });
    }
  }

   
   @Get('by-hotelier/:hotelierId')
  async getReservationsByHotelier(
    @Res() response,
    @Param('hotelierId') hotelierId: string
  ) {
    try {
      const reservations = await this.reservationService.getReservationByHotelierId(hotelierId);
      return response.status(200).json({
        message: 'Réservations récupérées avec succès',
        reservations
      });
    } catch (error) {
      return response.status(400).json({
        message: 'Erreur lors de la récupération des réservations',
        error: error.message
      });
    }
  }

}
