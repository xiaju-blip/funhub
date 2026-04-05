import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TradeService } from './trade.service';
import { TradeController } from './trade.controller';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [TradeController],
  providers: [TradeService],
})
export class TradeModule {}
