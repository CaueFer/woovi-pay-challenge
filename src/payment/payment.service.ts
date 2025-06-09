import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { PixKey } from './entities/pix_key.entity';
import { Payment } from './entities/payment.entity';
import { User } from 'src/user/entities/user.entity';
import { SavePixKeyDto } from './dto/savePixKey.dto';
import { PixKeyResponse } from './entities/pix_key_response.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,

    @InjectRepository(PixKey)
    private pixKeyRepository: Repository<PixKey>,
  ) {}

  async savePixKey(
    owner: Partial<User>,
    newPix: SavePixKeyDto,
  ): Promise<PixKeyResponse> {
    const pixDb = await this.pixKeyRepository.findOneBy({
      key: newPix.key,
    });

    if (pixDb) return { message: 'Pix Key already registered.' };

    const pixEntity = this.pixKeyRepository.create({
      key: newPix.key,
      owner,
    });

    const savedPix = await this.pixKeyRepository.save(pixEntity);
    return { pixKey: savedPix.key };
  }
}
