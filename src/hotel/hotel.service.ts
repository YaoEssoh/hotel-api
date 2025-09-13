import { Injectable, NotFoundException, BadGatewayException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Hotel } from './entities/hotel.entity';
import { IHotel } from './interface/interface.hotel';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';

@Injectable()
export class HotelService {
  constructor(
    @InjectModel(Hotel.name) private readonly hotelModel: Model<IHotel>,
  ) {}

  // Créer un nouvel hôtel
  async createNewHotel(createHotelDto: CreateHotelDto): Promise<IHotel> {
    const newHotel = new this.hotelModel(createHotelDto);
    return newHotel.save();
  }

  // Lister tous les hôtels avec chambres et évaluations peuplées
  async listHotel(): Promise<IHotel[]> {
    return this.hotelModel
      .find()
      .populate('chambre')
      .populate('evaluation')
      .exec();
  }

  // Récupérer un hôtel par son ID
  async getOneHotel(id: string): Promise<IHotel> {
    const hotel = await this.hotelModel
      .findById(id)
      .populate('chambre')
      .populate('evaluation')
      .exec();
    if (!hotel) throw new NotFoundException("Hôtel introuvable");
    return hotel;
  }

  // Mettre à jour un hôtel
  async updateHotel(id: string, updateHotelDto: UpdateHotelDto): Promise<IHotel> {
    const hotel = await this.hotelModel.findByIdAndUpdate(id, updateHotelDto, { new: true });
    if (!hotel) throw new NotFoundException("Hôtel introuvable");
    return hotel;
  }

  // Supprimer un hôtel
  async deleteHotel(id: string): Promise<IHotel> {
    const hotel = await this.hotelModel.findByIdAndDelete(id);
    if (!hotel) throw new NotFoundException("Hôtel introuvable");
    return hotel;
  }

  // Rechercher des hôtels par nombre d'étoiles
  async findByNombreEtoiles(etoiles: number): Promise<IHotel[]> {
    return this.hotelModel
      .find({ nombreEtoiles: etoiles })
      .populate('chambre')
      .populate('evaluation')
      .exec();
  }

  // Statistiques globales (optionnel)
  async getStats() {
    const hotels = await this.hotelModel
      .find()
      .populate('chambre')
      .populate('evaluation')
      .exec();

    if (!hotels.length) throw new NotFoundException("Aucun hôtel trouvé");

    const totalHotels = hotels.length;
    const totalChambres = hotels.reduce((acc, hotel) => acc + (hotel.chambre?.length || 0), 0);
    const tarifMoyenGlobal =
      hotels.reduce((acc, hotel) => acc + (Number(hotel.tarifMoyen || 0)), 0) / totalHotels;

    // Statistiques des évaluations
    let totalEvaluations = 0;
    let sommeNotes = 0;
    hotels.forEach((hotel) => {
      if (hotel.evaluation && hotel.evaluation.length > 0) {
        totalEvaluations += hotel.evaluation.length;
        hotel.evaluation.forEach((ev: any) => {
          if (ev.note) sommeNotes += ev.note;
        });
      }
    });
    const noteMoyenne = totalEvaluations > 0 ? sommeNotes / totalEvaluations : null;

    return {
      totalHotels,
      totalChambres,
      tarifMoyenGlobal: Number(tarifMoyenGlobal.toFixed(2)),
      totalEvaluations,
      noteMoyenne: noteMoyenne ? Number(noteMoyenne.toFixed(2)) : null,
    };
  }
}
