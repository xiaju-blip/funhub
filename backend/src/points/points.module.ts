import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PointsService } from './points.service';
import { PointsController } from './points.controller';
import { UserPoints } from './entities/user-points.entity';
import { PointsTransactions } from './entities/points-transactions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserPoints, PointsTransactions])],
  controllers: [PointsController],
  providers: [PointsService],
  exports: [PointsService],
})
export class PointsModule {}
