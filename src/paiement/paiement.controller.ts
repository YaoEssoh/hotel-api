import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Put, HttpException, HttpStatus, HttpCode } from '@nestjs/common';
import { PaiementService } from './paiement.service';
import { CreatePaiementDto } from './dto/create-paiement.dto';
import { UpdatePaiementDto } from './dto/update-paiement.dto';
import { join } from 'path';
import { Paiement } from './entities/paiement.entity';

@Controller('paiement')
export class PaiementController {
  constructor(private readonly paiementService: PaiementService) {}



   // Créer un paiement
  @Post()
  async create(@Res() response, @Body() createPaiementDto: CreatePaiementDto, ): Promise<Paiement> {
    try {

      const paiement =  await this.paiementService.createPaiementMob(createPaiementDto);
      return response.status(201).json({
        message: 'Le paiement a été effectué avec succès',
        paiement,
      });
    } catch (error) {
      return response.status(400).json({
        message: "La piement n'a pas été effectué" + error,
      });
    }
  }

  @Post('create-checkout-session/:id')
  async createCheckoutSession(@Param('id') reservationId:string) {
    try {
      const session = await this.paiementService.createPayement(reservationId);
      return { id: session.id };
    } catch (error) {
      console.error('Error in PaymentController:', error);
      throw new HttpException(
        'Failed to create payment session',
        error.status || 500,
      );
    }
  }

 
  @Get('success')
  success(@Res() res: any) {
    return res.sendFile(join(__dirname, '..', '..', 'public', 'success.html'));
  }

  @Get('cancel')
  cancel(@Res() res: any) {
    return res.sendFile(join(__dirname,  '..', '..', 'public', 'cancel.html'));
  }


 
}
