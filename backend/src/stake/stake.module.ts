import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StakeService } from './stake.service';
import { StakeController } from './stake.controller';
import { StakePool } from './entities/stake-pool.entity';
import { StakeRecord } from './entities/stake-record.entity';
import { StakeEarningsPeriods } from './entities/stake-earnings-periods.entity';
import { TokenModule } from '../token/token.module';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([StakePool, StakeRecord, StakeEarningsPeriods, User]),
    TokenModule,
  ],
  controllers: [StakeController],
  providers: [StakeService],
  exports: [StakeService],
})
export class StakeModule {}
