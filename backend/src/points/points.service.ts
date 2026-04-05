import { Injectable } from '@nestjs/common';

@Injectable()
export class PointsService {
  async getBalance(userId: number) {
    // TODO: 获取用户积分余额
    return { balance: 0, totalEarned: 0, totalSpent: 0 };
  }

  async getTransactions(userId: number) {
    // TODO: 获取积分交易流水
    return [];
  }
}
