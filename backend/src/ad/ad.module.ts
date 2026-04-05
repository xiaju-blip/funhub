import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdService } from './ad.service';
import { AdController } from './ad.controller';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [AdController],
  providers: [AdService],
})
export class AdModule {}
