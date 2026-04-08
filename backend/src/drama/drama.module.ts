import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DramaService } from './drama.service';
import { DramaController } from './drama.controller';
import { Drama } from './entities/drama.entity';
import { DramaEpisode } from './entities/drama-episode.entity';
import { WatchRecord } from './entities/watch-record.entity';
import { PointsModule } from '../points/points.module';
import { TokenModule } from '../token/token.module';

@Module({
  imports: [TypeOrmModule.forFeature([Drama, DramaEpisode, WatchRecord]), PointsModule, TokenModule],
  controllers: [DramaController],
  providers: [DramaService],
})
export class DramaModule {}
