import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';

import { PaymentService } from './payment.service';
import { SavePixKeyDto } from './dto/savePixKey.dto';
import { RequestWithUser } from 'src/lib/globalType';
import { PixKeyResponse } from './entities/pix_key_response.entity';
import { RateLimitByUserId } from 'src/auth/guards/ratelimituserid';

@UseGuards(RateLimitByUserId)
@Resolver()
export class PaymentResolver {
  constructor(private paymentService: PaymentService) {}

  @Mutation(() => PixKeyResponse)
  async savePixKey(
    @Context() context: { req: RequestWithUser },
    @Args('newPix') newPix: SavePixKeyDto,
  ): Promise<PixKeyResponse> {
    const user = context.req.user;

    if (!user)
      return {
        message: 'Invalid pix owner',
      };

    return await this.paymentService.savePixKey(user, newPix);
  }
}
