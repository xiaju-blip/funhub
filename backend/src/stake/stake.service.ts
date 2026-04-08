import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StakePool } from './entities/stake-pool.entity';
import { StakeRecord } from './entities/stake-record.entity';
import { StakeEarningsPeriods } from './entities/stake-earnings-periods.entity';
import { TokenService } from '../token/token.service';

@Injectable()
export class StakeService {
  constructor(
    @InjectRepository(StakePool)
    private stakePoolRepository: Repository<StakePool>,
    @InjectRepository(StakeRecord)
    private stakeRecordRepository: Repository<StakeRecord>,
    @InjectRepository(StakeEarningsPeriods)
    private stakeEarningsPeriodsRepository: Repository<StakeEarningsPeriods>,
    private tokenService: TokenService,
  ) {}

  async getOverview() {
    // TODO: Calculate total staked
    return {
      totalStaked: 0,
      totalEarned: 0,
      apy: 5,
    };
  }

  async getPools() {
    return this.stakePoolRepository.find({ where: { status: 1 }, order: { sortOrder: 'ASC' } });
  }

  async getMyStake(userId: number) {
    return this.stakeRecordRepository.find({ where: { userId, status: 1 } });
  }

  async deposit(
    userId: number,
    poolId: number,
    amount: number,
    vipLevel: number,
  ) {
    const pool = await this.stakePoolRepository.findOne({ where: { id: poolId } });
    if (!pool) {
      return { success: false, message: 'Pool not found' };
    }

    // Check min/max
    if (amount < pool.minStake) {
      return { success: false, message: 'Amount below minimum' };
    }
    if (pool.maxStake) {
      // TODO: Check total staked in pool
    }

    // Calculate lock end time
    const lockEndTime = new Date();
    lockEndTime.setDate(lockEndTime.getDate() + pool.lockDays);

    // 分段计息 - close previous period
    // For simplicity, we create a new record
    const stake = this.stakeRecordRepository.create({
      userId,
      poolId,
      amount,
      vipLevelAtStake: vipLevel,
      lockEndTime,
    });
    await this.stakeRecordRepository.save(stake);

    // Get expected earn
    const apy = this.calculateApy(pool.baseApy, vipLevel);
    const days = pool.lockDays;
    const expectedEarn = amount * apy / 100 * (days / 365);

    // Deduct tokens from user
    await this.tokenService.deductTokens(userId, amount, 3);

    return { success: true, stakeId: stake.id, expectedEarn };
  }

  async claim(userId: number, stakeId: number) {
    const stake = await this.stakeRecordRepository.findOne({
      where: { id: stakeId, userId },
    });
    if (!stake) {
      return { success: false, message: 'Stake not found' };
    }

    // Calculate pending earned
    const pool = await this.stakePoolRepository.findOne({ where: { id: stake.poolId } });
    const apy = this.calculateApy(pool.baseApy, stake.vipLevelAtStake);
    const now = new Date();
    const start = stake.createdAt;
    const days = (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    const earned = Number(stake.amount) * apy / 100 * (days / 365) - Number(stake.totalEarned);

    // Transfer to user
    await this.tokenService.addTokens(userId, earned, 3);

    // Update total earned
    stake.totalEarned = Number(stake.totalEarned) + earned;
    stake.pendingEarned = 0;
    await this.stakeRecordRepository.save(stake);

    return { success: true, claimedAmount: earned };
  }

  async withdraw(userId: number, stakeId: number) {
    const stake = await this.stakeRecordRepository.findOne({
      where: { id: stakeId, userId },
    });
    if (!stake) {
      return { success: false, message: 'Stake not found' };
    }

    const pool = await this.stakePoolRepository.findOne({ where: { id: stake.poolId } });
    const now = new Date();
    const isExpired = now >= stake.lockEndTime;

    // Calculate earned
    const apy = this.calculateApy(pool.baseApy, stake.vipLevelAtStake);
    const start = stake.createdAt;
    const days = (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    let earned = Number(stake.amount) * apy / 100 * (days / 365) - Number(stake.totalEarned);

    // Penalty for early withdrawal
    let penalty = 0;
    if (!isExpired && pool.lockDays > 0) {
      penalty = earned * (pool.penaltyRate / 100);
      earned = earned - penalty;
    }

    // Total withdraw amount = principal + net earned
    const withdrawAmount = Number(stake.amount) + earned;

    // Transfer to user
    await this.tokenService.addTokens(userId, withdrawAmount, 3);

    // Mark stake as withdrawn
    stake.status = 0;
    await this.stakeRecordRepository.save(stake);

    return { success: true, withdrawAmount, penalty };
  }

  private calculateApy(baseApy: number, vipLevel: number): number {
    // VIP加成: base + VIP level * 0.5%
    return baseApy + (vipLevel * 0.5);
  }

  async getUserTotalStaked(userId: number): Promise<number> {
    const records = await this.stakeRecordRepository.find({ where: { userId, status: 1 } });
    let total = 0;
    records.forEach(r => total += Number(r.amount));
    return total;
  }
}
