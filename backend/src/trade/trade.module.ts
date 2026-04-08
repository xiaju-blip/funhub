import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TradeService } from './trade.service';
import { TradeController } from './trade.controller';
import { TradeOrder } from './entities/order.entity';
import { TradeHistory } from './entities/trade-history.entity';
import { TokenModule } from '../token/token.module';

@Module({
  imports: [TypeOrmModule.forFeature([TradeOrder, TradeHistory]), TokenModule],
  controllers: [TradeController],
  providers: [TradeService],
})
export class TradeModule {}
