import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VipLevel } from './entities/vip-level.entity';
import { StakeService } from '../stake/stake.service';

@Injectable()
export class VipService {
  constructor(
    @InjectRepository(VipLevel)
    private vipLevelRepository: Repository<VipLevel>,
    private stakeService: StakeService,
  ) {}

  async getLevels() {
    return this.vipLevelRepository.find({
      where: { status: 1 },
      order: { level: 'ASC' },
    });
  }

  async getUserVipLevel(userId: number) {
    const totalStaked = await this.stakeService.getUserTotalStaked(userId);
    const levels = await this.getLevels();

    let currentLevel = levels[0];
    for (const level of levels) {
      if (totalStaked >= level.requiredToken) {
        currentLevel = level;
      } else {
        break;
      }
    }

    return {
      currentLevel,
      totalStaked,
      nextLevel: levels.find(l => l.level > currentLevel.level),
    };
  }

  async getVipBonus(userId: number, type: 'stake' | 'poe') {
    const { currentLevel } = await this.getUserVipLevel(userId);
    if (type === 'stake') {
      return Number(currentLevel.stakeBonusPercent);
    }
    if (type === 'poe') {
      return Number(currentLevel.poeBonusPercent);
    }
    return 0;
  }
}
