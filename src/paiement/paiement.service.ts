import { BadGatewayException, BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaiementDto } from './dto/create-paiement.dto';
import { UpdatePaiementDto } from './dto/update-paiement.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Paiement } from './entities/paiement.entity';
import { IPaiement } from './interface/interface.paiement';
import mongoose, { Model, Types } from 'mongoose';
import { IReservation } from 'src/reservation/interface/interface.reservation';
import Stripe from 'stripe';
import { promises } from 'dns';

@Injectable()
export class PaiementService {
  private stripe:Stripe;
   constructor( @InjectModel(Paiement.name) private readonly paiementModel: Model<IPaiement>,
                  @InjectModel('Reservation')private readonly reservationModel: Model<IReservation>
   
    
  ) {
    this.stripe=new Stripe(process.env.STRIPE_SECRET_KEY! ,{apiVersion:'2025-02-24.acacia' as any,})
  }

 async listPaiement(): Promise<IPaiement[]> {
          const listeData = await this.paiementModel.find().exec(); 
          if (listeData.length === 0) {
            throw new NotFoundException('Aucun paiement effectué');
          }
          return listeData;
        }
  async getOnePaiement(id:string): Promise<IPaiement>{
    const getPaiementById= await this.paiementModel.findById(id)
    if(!getPaiementById){
      throw new BadRequestException("aucun paiement")
  }
  return getPaiementById
  
  }
  async createPayement(reservationId):Promise<any>{
    try{
      const reservation=await this.reservationModel.findById(reservationId)
      if(!reservation){
        throw new NotFoundException('reservation non trouover')
      }
      const montantTotal=reservation.total
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types:['card'],
        line_items:[
          {
            price_data:{
              currency:'usd',
              product_data:{
                name:'product simple'
              },
              unit_amount:montantTotal * 100,
            },
            quantity:1
          }
        ],
        mode:'payment',
        //success_url:'http://localhost:3000/paiement/success',
        success_url:'https://hotel-client-24h6.onrender.com/paiement/success',
        cancel_url:'https://hotel-client-24h6.onrender.com/paiement/cancel',
        //cancel_url:'http://localhost:3000/paiement/cancel',
      })
      return session;
    }catch (error){
      console.error('Error creating checkout session:',error);
      throw new HttpException(
        'Unable to create checkout session',
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }  
  }

  async createPaiementMob(createPaiementDto: CreatePaiementDto): Promise<Paiement> {
    // Vérifier que l'ID de réservation est valide
    if (!Types.ObjectId.isValid(createPaiementDto.reservation)) {
      throw new NotFoundException("Réservation invalide.");
    }

    const newPaiement = new this.paiementModel(createPaiementDto);
    const savedPaiement = await newPaiement.save();
    // 🔹 Mettre à jour le statut de la réservation en "Paid" si le paiement est validé
    if (createPaiementDto.statut.toLowerCase() === 'success' || createPaiementDto.statut.toLowerCase() === 'paid') {
    await this.reservationModel.findByIdAndUpdate(
    createPaiementDto.reservation,
      { statut: 'Paid' }, // statut de la réservation
      { new: true },
    );
  }

  return savedPaiement;
  }
  
}
