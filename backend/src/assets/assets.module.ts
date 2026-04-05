import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetsService } from './assets.service';
import { AssetsController } from './assets.controller';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [AssetsController],
  providers: [AssetsService],
})
export class AssetsModule {}
