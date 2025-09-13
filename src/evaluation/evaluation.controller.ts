import { Controller, Post, Get, Body, Param, Res, BadRequestException, NotFoundException } from '@nestjs/common';
import { EvaluationService } from './evaluation.service';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { Response } from 'express';

@Controller('evaluation')
export class EvaluationController {
  constructor(private readonly evaluationService: EvaluationService) {}

  @Post()
  async create(@Body() dto: CreateEvaluationDto) {
    try {
      const evaluation = await this.evaluationService.createEvaluation(dto);
      return { message: 'Évaluation créée', evaluation };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  async getAll(@Res() res: Response) {
    try {
      const data = await this.evaluationService.listEvaluations();
      return res.status(200).json({ message: 'Liste des évaluations', data });
    } catch (error) {
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  }

  @Get('/client/:clientId')
  async getByClient(@Param('clientId') clientId: string, @Res() res: Response) {
    try {
      const data = await this.evaluationService.getEvaluationsByClient(clientId);
      return res.status(200).json({ message: 'Évaluations du client', data });
    } catch (err) {
      return res.status(404).json({ message: 'Client introuvable ou aucune évaluation', error: err.message });
    }
  }

  /*@Get('/hotel/:hotelId')
  async getByHotel(@Param('hotelId') hotelId: string, @Res() res: Response) {
    try {
      const data = await this.evaluationService.getEvaluationsByHotel(hotelId);
      return res.status(200).json({ message: 'Évaluations de l’hôtel', data });
    } catch (err) {
      return res.status(404).json({ message: 'Hôtel introuvable ou aucune évaluation', error: err.message });
    }
  }*/

   @Get('hotel/:hotelId')
  async getEvaluationsByHotel(@Param('hotelId') hotelId: string) {
    const evaluations = await this.evaluationService.findByHotelId(hotelId);

    if (!evaluations || evaluations.length === 0) {
      return {
      hotelId,
      total: evaluations.length,
      evaluations,
    };
    }

    return {
      hotelId,
      total: evaluations.length,
      evaluations,
    };
  }
}


