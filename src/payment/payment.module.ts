import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PaymentService } from './payment.service';
import { PaymentResolver } from './payment.resolver';

import { PixKey } from './entities/pix_key.entity';
import { Payment } from './entities/payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, PixKey])],
  providers: [PaymentResolver, PaymentService],
})
export class PaymentModule {}
