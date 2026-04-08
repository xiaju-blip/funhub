import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VipService } from './vip.service';
import { VipController } from './vip.controller';
import { VipLevel } from './entities/vip-level.entity';
import { StakeModule } from '../stake/stake.module';

@Module({
  imports: [TypeOrmModule.forFeature([VipLevel]), StakeModule],
  controllers: [VipController],
  providers: [VipService],
  exports: [VipService],
})
export class VipModule {}