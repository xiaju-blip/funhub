import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PointsService } from './points.service';
import { PointsController } from './points.controller';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [PointsController],
  providers: [PointsService],
})
export class PointsModule {}
