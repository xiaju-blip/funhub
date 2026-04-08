import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPoints } from './entities/user-points.entity';
import { PointsTransactions } from './entities/points-transactions.entity';

@Injectable()
export class PointsService {
  constructor(
    @InjectRepository(UserPoints)
    private userPointsRepository: Repository<UserPoints>,
    @InjectRepository(PointsTransactions)
    private pointsTransactionsRepository: Repository<PointsTransactions>,
  ) {}

  async getBalance(userId: number) {
    let userPoints = await this.userPointsRepository.findOne({ where: { userId } });
    if (!userPoints) {
      userPoints = this.userPointsRepository.create({ userId, balance: 0, totalEarned: 0, totalSpent: 0 });
      await this.userPointsRepository.save(userPoints);
    }
    return {
      balance: userPoints.balance,
      totalEarned: userPoints.totalEarned,
      totalSpent: userPoints.totalSpent,
    };
  }

  async getTransactions(userId: number) {
    const transactions = await this.pointsTransactionsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 50,
    });
    return transactions;
  }

  async addPoints(
    userId: number,
    amount: number,
    type: number,
    sourceId?: string,
  ): Promise<number> {
    let userPoints = await this.userPointsRepository.findOne({ where: { userId } });
    if (!userPoints) {
      userPoints = this.userPointsRepository.create({
        userId,
        balance: 0,
        totalEarned: 0,
        totalSpent: 0,
      });
    }

    const oldBalance = userPoints.balance;
    userPoints.balance += amount;
    userPoints.totalEarned += amount;

    await this.userPointsRepository.save(userPoints);

    // 记录流水
    const transaction = this.pointsTransactionsRepository.create({
      userId,
      type,
      amount,
      balanceAfter: userPoints.balance,
      sourceId,
    });
    await this.pointsTransactionsRepository.save(transaction);

    return userPoints.balance;
  }

  async deductPoints(
    userId: number,
    amount: number,
    type: number,
    sourceId?: string,
  ): Promise<{ success: boolean; newBalance: number }> {
    let userPoints = await this.userPointsRepository.findOne({ where: { userId } });
    if (!userPoints || userPoints.balance < amount) {
      return { success: false, newBalance: userPoints?.balance || 0 };
    }

    const oldBalance = userPoints.balance;
    userPoints.balance -= amount;
    userPoints.totalSpent += amount;

    await this.userPointsRepository.save(userPoints);

    // 记录流水（扣减为负数）
    const transaction = this.pointsTransactionsRepository.create({
      userId,
      type,
      amount: -amount,
      balanceAfter: userPoints.balance,
      sourceId,
    });
    await this.pointsTransactionsRepository.save(transaction);

    return { success: true, newBalance: userPoints.balance };
  }
}
