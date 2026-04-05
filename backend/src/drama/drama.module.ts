import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DramaService } from './drama.service';
import { DramaController } from './drama.controller';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [DramaController],
  providers: [DramaService],
})
export class DramaModule {}
