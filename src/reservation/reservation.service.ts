//reservation.service.ts
/* eslint-disable prettier/prettier */
import { BadGatewayException, BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Reservation } from './entities/reservation.entity';
import { IReservation } from './interface/interface.reservation';
import mongoose, { Model, Types } from 'mongoose';
import { IChambre } from 'src/chambre/interface/interface.chambre';
import { IClient } from 'src/client/interface/interface.client';

@Injectable()
export class ReservationService {
  constructor(
    @InjectModel('Reservation')
    private readonly reservationModel: Model<IReservation>,
    @InjectModel('Chambre') private readonly chambreModel: Model<IChambre>,
    @InjectModel('Client') private readonly clientModel: Model<IClient>,
  ) {}

  async createNewReservation(
    createReservationDto: CreateReservationDto,
  ): Promise<IReservation> {
    // Étape 1 : Vérifier et récupérer la chambre
    const chambre = (await this.chambreModel.findById(
      createReservationDto.chambre,
    )) as IChambre;
    const clients = await this.clientModel.find({
      _id: { $in: createReservationDto.client },
    });
    if (!chambre || !clients) {
      throw new Error('client et chambre introuvable');
    }

    // Étape 2 : Vérifier le nombre de nuits
    const nombreDeNuit = createReservationDto.nombreDeNuits;

    // Étape 3 : Calcul du total
    const total = createReservationDto.total;

    // Étape 4 : Création de la réservation avec les données fournies + total
    const newReservation = new this.reservationModel({
      ...createReservationDto,
      total,
    });

    const saveReservation = (await newReservation.save()) as IReservation;

    // Étape 5 : Vérifier et associer les clients

    if (clients.length > 0) {
      saveReservation.client =
        createReservationDto.client as mongoose.Types.ObjectId[];
      const savedReservation = await saveReservation.save();
      console.log(savedReservation);
      return savedReservation;
    }

    return saveReservation;
  }

  async listReservation(): Promise<IReservation[]> {
    const listeData = await this.reservationModel
      .find()
      .populate('chambre')
      .populate('client');
    return listeData;
  }

  /*async getReservationsByClientId(clientId: string): Promise<IReservation[]> {
  return await this.reservationModel
    .find({ client: clientId })
    .populate('chambre')
    .populate('client')
    .populate('paiement');
}*/


 async getReservationsByClientId(clientId: string): Promise<IReservation[]> {
    if (!Types.ObjectId.isValid(clientId)) {
      throw new NotFoundException('Invalid client ID format.');
    }

    // Convert the string ID to a Mongoose ObjectId
    const clientObjectId = new Types.ObjectId(clientId);

    const reservations = await this.reservationModel
      .find({ client: clientId }) // Query by the client ID
      .populate({
        path: 'chambre',
        populate: {
          path: 'hotel', // Populate the hotel details from the chambre
          model: 'Hotel', // Explicitly specify the model name if not inferred
        },
        model: 'Chambre', // Explicitly specify the model name
      })
      .populate('client', '-password') // Populate client details, excluding password if it exists
      .populate('paiement'); // Populate payment details

    if (!reservations || reservations.length === 0) {
      // You might want to throw an exception or return an empty array
      // depending on your desired behavior when no reservations are found.
      throw new NotFoundException(`No reservations found for client with ID: ${clientId}`);
    }

    return reservations;
  }



  async updateReservationStatus(id: string, statut: 'Pending' | 'Confirmed' | 'Cancelled'): Promise<IReservation> {
    if (!['Pending', 'Confirmed', 'Cancelled'].includes(statut)) {
      throw new BadRequestException('Statut invalide');
    }
  
    const updatedReservation = await this.reservationModel.findByIdAndUpdate(
      id,
      { statut },
      { new: true }
    );
  
    if (!updatedReservation) {
      throw new NotFoundException(`Réservation avec ID ${id} non trouvée`);
    }
  
    return updatedReservation;
  }
  

  async deleteReservation(id: string): Promise<IReservation> {
    // Vérifier que l'ID est valide
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadGatewayException(`ID de réservation invalide : ${id}`);
    }

    // 🔹 Supprimer la réservation par son ID
    const deleteReservation = await this.reservationModel.findByIdAndDelete(id);
    if (!deleteReservation) {
      throw new NotFoundException(`Réservation #${id} n'est pas définie`);
    }

    // 🔹 Suppression de la référence à la réservation dans la chambre associée
    const updateChambre = await this.chambreModel.findById(
      deleteReservation.chambre,
    );
    if (updateChambre) {
      updateChambre.reservation = updateChambre.reservation.filter(
        (reservationId) => reservationId.toString() !== id,
      ); // Retirer la réservation supprimée de la liste
      await updateChambre.save();
    } else {
      throw new NotFoundException(
        `Chambre associée à la réservation #${id} n'est pas définie`,
      );
    }

    // 🔹 Suppression de la référence à la réservation dans le client associé
    await this.clientModel.updateOne(
      { _id: deleteReservation.client },
      { $unset: { reservation: '' } }, // 🔥 Supprime proprement la clé 'reservation'
    );

    return deleteReservation;
  }

  async updateReservation(
    id: string,
    updateReservationDto: UpdateReservationDto,
  ): Promise<IReservation> {
    const updateReservation = await this.reservationModel.findByIdAndUpdate(
      id,
      updateReservationDto,
      { new: true },
    );
    if (!updateReservation) {
      throw new BadGatewayException('Aucune reservation trouvée');
    }
    return updateReservation;
  }
  async getOneReservation(id: string): Promise<IReservation> {
    const getReservationById = await this.reservationModel.findById(id);
    if (!getReservationById) {
      throw new BadRequestException('Aucune reservation trouvée');
    }
    return getReservationById;
  }

  async isRoomAvailable(
    roomId: string,
    checkIn: Date,
    checkOut: Date,
  ): Promise<boolean> {
    const overlappingReservations = await this.reservationModel
      .find({
        chambre: roomId,
        $or: [
          {
            dateDebut: { $lt: checkOut },
            dateFin: { $gt: checkIn },
          },
          {
            dateDebut: { $gte: checkIn, $lte: checkOut },
            dateFin: { $gte: checkIn, $lte: checkOut },
          },
        ],
        statut: { $ne: 'Cancelled' }, // Exclure les réservations annulées
      })
      .exec();

    return overlappingReservations.length === 0;
  }



  async getStats(/*hotelierId: string*/) {
  /*if (!mongoose.Types.ObjectId.isValid(hotelierId)) {
    throw new NotFoundException(`ID hôtelier invalide`);
  }*/

  // 🔹 Pipeline d'agrégation : on part des réservations
  const reservations = await this.reservationModel.aggregate([
    {
      $lookup: {
        from: 'chambres', // jointure avec la collection chambres
        localField: 'chambre',
        foreignField: '_id',
        as: 'chambreDetails'
      }
    },
    { $unwind: '$chambreDetails' },
    {
      $lookup: {
        from: 'hotels', // jointure avec la collection hotels
        localField: 'chambreDetails.hotel',
        foreignField: '_id',
        as: 'hotelDetails'
      }
    },
    { $unwind: '$hotelDetails' },
    /*{
      $match: {
        'hotelDetails.hotelier': new mongoose.Types.ObjectId(hotelierId)
      }
    }*/
  ]);

  /*if (!reservations.length) {
    throw new NotFoundException(`Aucune réservation trouvée pour cet hôtelier`);
  }*/

  // 🔹 Nombre de clients distincts
  const uniqueClientIds = new Set(reservations.map(r => r.client.toString()));
  const nombreClients = uniqueClientIds.size;

  // 🔹 Calcul des stats
  const totalReservations = reservations.length;
  const pendingCount = reservations.filter(r => r.statut === 'Pending').length;
  const confirmedCount = reservations.filter(r => r.statut === 'Confirmed').length;
  const cancelledCount = reservations.filter(r => r.statut === 'Cancelled').length;

  const totalRevenus = reservations.reduce((acc, r) => acc + (r.total || 0), 0);
  const dureeMoyenne = totalReservations > 0
    ? reservations.reduce((acc, r) => acc + (r.nombreDeNuits || 0), 0) / totalReservations
    : 0;

  return {
    nombreClients, // 👈 ajouté ici
    totalReservations,
    pendingCount,
    confirmedCount,
    cancelledCount,
    totalRevenus: Number(totalRevenus.toFixed(2)),
    dureeMoyenne: Number(dureeMoyenne.toFixed(2)),
  };
}
async getReservationByHotelierId(hotelierId: string): Promise<IReservation[]> {
  if (!mongoose.Types.ObjectId.isValid(hotelierId)) {
    throw new BadRequestException("ID hôtelier invalide");
  }

  const reservations = await this.reservationModel.aggregate([
    // 🔹 Jointure avec chambres
    {
      $lookup: {
        from: 'chambres',
        localField: 'chambre',
        foreignField: '_id',
        as: 'chambreDetails'
      }
    },
    { $unwind: '$chambreDetails' },

    // 🔹 Jointure avec hôtels
    {
      $lookup: {
        from: 'hotels',
        localField: 'chambreDetails.hotel',
        foreignField: '_id',
        as: 'hotelDetails'
      }
    },
    { $unwind: '$hotelDetails' },

    // 🔹 Filtre par hôtelier
    {
      $match: {
        'hotelDetails.hotelier': new mongoose.Types.ObjectId(hotelierId)
      }
    },

    // 🔹 Peupler les clients
    {
      $lookup: {
        from: 'utilisateurs',
        localField: 'client',
        foreignField: '_id',
        as: 'clientDetails'
      }
    },

    // 🔹 Peupler le paiement (si besoin)
    {
      $lookup: {
        from: 'paiements',
        localField: 'paiement',
        foreignField: '_id',
        as: 'paiementDetails'
      }
    }
  ]);

  if (!reservations.length) {
    throw new NotFoundException(
      `Aucune réservation trouvée pour l'hôtelier avec ID ${hotelierId}`
    );
  }

  return reservations;
}


}
