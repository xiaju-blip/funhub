import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Drama } from './entities/drama.entity';
import { DramaEpisode } from './entities/drama-episode.entity';
import { WatchRecord } from './entities/watch-record.entity';
import { PointsService } from '../points/points.service';
import { LessThan } from 'typeorm';

@Injectable()
export class DramaService {
  constructor(
    @InjectRepository(Drama)
    private dramaRepository: Repository<Drama>,
    @InjectRepository(DramaEpisode)
    private dramaEpisodeRepository: Repository<DramaEpisode>,
    @InjectRepository(WatchRecord)
    private watchRecordRepository: Repository<WatchRecord>,
    private pointsService: PointsService,
  ) {}

  async getHotList() {
    return this.dramaRepository.find({
      where: { status: 1 },
      order: { releaseTime: 'DESC' },
      take: 10,
    });
  }

  async getEpisodes(dramaId: number) {
    return this.dramaEpisodeRepository.find({
      where: { dramaId },
      order: { sortOrder: 'ASC' },
    });
  }

  async getDetail(dramaId: number) {
    return this.dramaRepository.findOne({ where: { id: dramaId } });
  }

  async recordWatch(
    userId: number,
    dramaId: number,
    episodeId: number,
    duration: number,
    isCompleted: boolean,
    hasInteraction: boolean,
    deviceFingerprint: string,
    ipAddress: string,
  ) {
    // Check rate limit: same episode same device max 5 per day
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const count = await this.watchRecordRepository.count({
      where: {
        userId,
        dramaId,
        episodeId,
        deviceFingerprint,
        lastWatchTime: Between(today, tomorrow),
      },
    });

    // PoE 积分计算
    let pointsEarned = 0;
    const basePoints = duration; // 1 point per minute
    if (basePoints > 0) {
      //完播系数
      const completeCoeff = isCompleted ? 1.2 : 0.5;
      //互动系数
      const interactionCoeff = hasInteraction ? 1.1 : 1.0;
      pointsEarned = Math.floor(basePoints * completeCoeff * interactionCoeff);

      // Daily limit 200 points
      const todayTotal = await this.getTodayTotalPoints(userId);
      const newTotal = todayTotal + pointsEarned;
      if (newTotal > 200) {
        pointsEarned = 200 - todayTotal;
      }

      if (pointsEarned > 0) {
        await this.pointsService.addPoints(userId, pointsEarned, 1, `${dramaId}-${episodeId}`);
      }
    }

    // 首集完播奖励
    if (isCompleted) {
      const existing = await this.watchRecordRepository.findOne({
        where: { userId, dramaId, episodeId, isCompleted: 1 },
      });
      if (!existing) {
        // 首次完播额外奖励 10 积分
        await this.pointsService.addPoints(userId, 10, 1, `${dramaId}-${episodeId}-first`);
        pointsEarned += 10;
      }
    }

    // Save or update record
    let record = await this.watchRecordRepository.findOne({
      where: { userId, dramaId, episodeId, deviceFingerprint },
    });

    if (record) {
      record.watchDuration += duration;
      record.isCompleted = record.isCompleted || (isCompleted ? 1 : 0);
      record.hasInteraction = record.hasInteraction || (hasInteraction ? 1 : 0);
      record.lastWatchTime = new Date();
      await this.watchRecordRepository.save(record);
    } else {
      record = this.watchRecordRepository.create({
        userId,
        dramaId,
        episodeId,
        watchDuration: duration,
        isCompleted: isCompleted ? 1 : 0,
        hasInteraction: hasInteraction ? 1 : 0,
        deviceFingerprint,
        ipAddress,
      });
      await this.watchRecordRepository.save(record);
    }

    return { success: true, pointsEarned };
  }

  private async getTodayTotalPoints(userId: number): Promise<number> {
    // Calculate today total watch duration
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const result = await this.watchRecordRepository
      .createQueryBuilder('wr')
      .where('wr.userId = :userId', { userId })
      .andWhere('wr.lastWatchTime BETWEEN :today AND :tomorrow', { today, tomorrow })
      .select('SUM(wr.watchDuration)', 'total')
      .getRawOne();

    return Number(result?.total || 0);
  }

  async checkDailyFreeLimit(userId: number): Promise<{
    remaining: number;
    canWatch: boolean;
  }> {
    // Count episodes watched today
    const today = new Date();
    today.setHours(0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const count = await this.watchRecordRepository.count({
      where: {
        userId,
        lastWatchTime: Between(today, tomorrow),
      },
    });

    const limit = 10;
    const remaining = limit - count;
    return {
      remaining,
      canWatch: remaining > 0,
    };
  }
}

// Fix for Between import
import { Between } from 'typeorm';
