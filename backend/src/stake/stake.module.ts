import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StakeService } from './stake.service';
import { StakeController } from './stake.controller';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [StakeController],
  providers: [StakeService],
})
export class StakeModule {}
