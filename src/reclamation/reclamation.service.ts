import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Reclamation } from './entities/reclamation.entity';
import { CreateReclamationDto } from './dto/create-reclamation.dto';
import { IClient } from 'src/client/interface/interface.client';

@Injectable()
export class ReclamationService {
  constructor(
    @InjectModel('Reclamation')
    private readonly reclamationModel: Model<any>, // any pour éviter erreurs avec lean()
    @InjectModel('utilisateur')
    private readonly utilisateurModel: Model<IClient>
  ) {}

  async createReclamation(dto: CreateReclamationDto): Promise<any> {
    if (!dto.objet || !dto.message) {
      throw new BadRequestException('objet et message sont requis');
    }

    // si client fourni -> vérifier son existence
    if (dto.client) {
      if (!Types.ObjectId.isValid(dto.client)) {
        throw new BadRequestException('Client ID invalide');
      }
      const clientExists = await this.utilisateurModel.findById(dto.client).lean().exec();
      if (!clientExists) throw new NotFoundException('Client introuvable');
    }

    const data: any = {
      objet: dto.objet,
      message: dto.message,
      statut: dto.statut || 'open',
      client: dto.client ? dto.client : null,
      thread: Array.isArray(dto.thread) ? dto.thread : [],
      contactName: dto.contactName || undefined,
      contactEmail: dto.contactEmail || undefined,
    };

    const created = new this.reclamationModel(data);
    const saved = await created.save();

    const populated: any = await this.reclamationModel
      .findById(saved._id)
      .populate('client', 'name firstName lastName email')
      .lean()
      .exec();

    if (!populated) throw new NotFoundException('Réclamation introuvable après création');
    populated.thread = populated.thread || [];
    return populated;
  }

  async getReclamationsByClient(clientId: string) {
    if (!Types.ObjectId.isValid(clientId)) throw new BadRequestException('Client ID invalide');
    const docs: any[] = await this.reclamationModel
      .find({ client: clientId })
      .populate('client', 'name firstName lastName email')
      .lean()
      .exec();
    return docs.map(d => ({ ...d, thread: d.thread || [] }));
  }

  async listReclamations(opts?: { page?: number; limit?: number; statut?: string; search?: string }) {
    const page = opts?.page && opts.page > 0 ? opts.page : 1;
    const limit = opts?.limit && opts.limit > 0 ? opts.limit : 10;
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (opts?.statut && opts.statut !== 'all') filter.statut = opts.statut;
    if (opts?.search) {
      const q = opts.search.trim();
      if (q.length) filter.$or = [{ objet: { $regex: q, $options: 'i' } }, { message: { $regex: q, $options: 'i' } }];
    }

    const itemsRaw: any[] = await this.reclamationModel
      .find(filter)
      .populate('client', 'name firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    const total = await this.reclamationModel.countDocuments(filter).exec();

    const items = itemsRaw.map(item => ({ ...item, thread: item.thread || [] }));

    return { data: items, page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) };
  }

  async findById(id: string): Promise<any | null> {
    if (!Types.ObjectId.isValid(id)) return null;

    const document: any = await this.reclamationModel
      .findById(id)
      .populate('client', 'name firstName lastName email')
      .lean()
      .exec();

    if (document) document.thread = document.thread || [];
    return document;
  }

  async addMessage(id: string, author: string, message: string): Promise<any | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    if (!author || !message) throw new BadRequestException('author et message requis');

    const updatedDoc: any = await this.reclamationModel
      .findByIdAndUpdate(
        id,
        { $push: { thread: { author, message, createdAt: new Date() } }, $set: { updatedAt: new Date() } },
        { new: true }
      )
      .populate('client', 'name firstName lastName email')
      .lean()
      .exec();

    if (!updatedDoc) return null;
    updatedDoc.thread = updatedDoc.thread || [];
    return updatedDoc;
  }

  async changeStatus(id: string, statut: string): Promise<any | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    if (!statut) throw new BadRequestException('statut requis');

    const updatedDoc: any = await this.reclamationModel
      .findByIdAndUpdate(id, { $set: { statut, updatedAt: new Date() } }, { new: true })
      .populate('client', 'name firstName lastName email')
      .lean()
      .exec();

    if (!updatedDoc) return null;
    updatedDoc.thread = updatedDoc.thread || [];
    return updatedDoc;
  }

  async deleteReclamation(id: string): Promise<any | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const removed = await this.reclamationModel.findByIdAndDelete(id).lean().exec();
    return removed;
  }
}
