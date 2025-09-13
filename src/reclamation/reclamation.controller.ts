// src/reclamation/reclamation.controller.ts
import { Controller, Post, Get, Put, Delete, Body, Param, Res, BadRequestException } from '@nestjs/common';
import { ReclamationService } from './reclamation.service';
import { CreateReclamationDto } from './dto/create-reclamation.dto';
import { Response } from 'express';

@Controller('reclamation')
export class ReclamationController {
  constructor(private readonly reclamationService: ReclamationService) {}

  @Post()
  async create(@Body() dto: CreateReclamationDto) {
    try {
      const reclamation = await this.reclamationService.createReclamation(dto);
      return { message: 'Réclamation créée', data: reclamation };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  async getAll(@Res() res: Response) {
    try {
      const data = await this.reclamationService.listReclamations();
      return res.status(200).json({ message: 'Liste des réclamations', data });
    } catch (error) {
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  }

  @Get(':id')
  async getById(@Param('id') id: string, @Res() res: Response) {
    try {
      const data = await this.reclamationService.findById(id);
      if (!data) return res.status(404).json({ message: 'Réclamation non trouvée' });
      return res.status(200).json({ message: 'Réclamation', data });
    } catch (error) {
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  }

  // ajout message (reste ':id/message')
  @Put(':id/message')
  async addMessage(@Param('id') id: string, @Body() body: { author: string; message: string }, @Res() res: Response) {
    try {
      const updated = await this.reclamationService.addMessage(id, body.author, body.message);
      if (!updated) return res.status(404).json({ message: 'Réclamation non trouvée' });
      return res.status(200).json({ message: 'Message ajouté', data: updated });
    } catch (error) {
      return res.status(400).json({ message: 'Erreur lors de l\'ajout du message', error: error.message });
    }
  }

  // standardiser en "status" pour correspondre au front
  @Put(':id/status')
  async updateStatus(@Param('id') id: string, @Body() body: { statut: string; status?: string }, @Res() res: Response) {
    try {
      const statut = body.status ?? body.statut;
      const updated = await this.reclamationService.changeStatus(id, statut);
      if (!updated) return res.status(404).json({ message: 'Réclamation non trouvée' });
      return res.status(200).json({ message: 'Statut mis à jour', data: updated });
    } catch (error) {
      return res.status(400).json({ message: 'Erreur lors de la mise à jour du statut', error: error.message });
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Res() res: Response) {
    try {
      const deleted = await this.reclamationService.deleteReclamation(id);
      if (!deleted) return res.status(404).json({ message: 'Réclamation non trouvée' });
      return res.status(200).json({ message: 'Réclamation supprimée', data: deleted });
    } catch (error) {
      return res.status(400).json({ message: 'Erreur lors de la suppression', error: error.message });
    }
  }
}
