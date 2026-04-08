import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { UserTokens } from './entities/user-tokens.entity';
import { TokenTransactions } from './entities/token-transactions.entity';
import { Withdrawals } from './entities/withdrawals.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserTokens, TokenTransactions, Withdrawals])],
  controllers: [TokenController],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
