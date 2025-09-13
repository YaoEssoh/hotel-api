import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { IEvaluation } from './interface/interface.evaluation';
import { IClient } from 'src/client/interface/interface.client';
import { IHotel } from 'src/hotel/interface/interface.hotel';

import { Evaluation } from './entites/evaluation.entity';
import { Client } from 'src/client/entities/client.entity';
import path from 'path';

@Injectable()
export class EvaluationService {
  constructor(
    @InjectModel(Evaluation.name)
    private readonly evaluationModel: Model<IEvaluation>,

    @InjectModel('utilisateur')
    private readonly utilisateurModel: Model<IClient>,

    @InjectModel('Hotel') // si tu n'as pas de classe Hotel définie
    private readonly hotelModel: Model<IHotel>,
  ) {}

  /**
   * Créer une nouvelle évaluation
   */
  async createEvaluation(dto: CreateEvaluationDto): Promise<IEvaluation> {
    const client = await this.utilisateurModel.findById(dto.client);
    if (!client) {
      throw new NotFoundException("Client introuvable");
    }

    const hotel = await this.hotelModel.findById(dto.hotel);
    if (!hotel) {
      throw new NotFoundException("Hôtel introuvable");
    }

    const evaluation = new this.evaluationModel({
      note: dto.note,
      commentaire: dto.commentaire,
      date: new Date(),
      client: dto.client,
      hotel: dto.hotel,
    });

    return evaluation.save();
  }

  /**
   * Lister toutes les évaluations
   */
  async listEvaluations(): Promise<IEvaluation[]> {
    return this.evaluationModel.find().populate({
      path:"client",
      model:"utilisateur",
      select: 'nom prenom email',
    }).populate('hotel').exec();
  }

  /**
   * Récupérer les évaluations d’un client
   */
  async getEvaluationsByClient(clientId: string): Promise<IEvaluation[]> {
    const evaluations = await this.evaluationModel.find({ client: clientId }).populate('hotel').exec();
    if (!evaluations.length) {
      throw new NotFoundException("Aucune évaluation trouvée pour ce client.");
    }
    return evaluations;
  }

  /**
   * Récupérer les évaluations d’un hôtel
   */

  // ✅ Récupérer toutes les évaluations d'un hôtel
  async findByHotelId(hotelId: string): Promise<IEvaluation[]> {
    const evaluations = await this.evaluationModel.find({ hotel: hotelId }).populate({
      path:"client", 
      model:"utilisateur",
      select: 'nom prenom email',
    }).exec();
    return evaluations;
  }
}
