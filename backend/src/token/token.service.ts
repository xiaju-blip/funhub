import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserTokens } from './entities/user-tokens.entity';
import { TokenTransactions } from './entities/token-transactions.entity';
import { Withdrawals } from './entities/withdrawals.entity';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(UserTokens)
    private userTokensRepository: Repository<UserTokens>,
    @InjectRepository(TokenTransactions)
    private tokenTransactionsRepository: Repository<TokenTransactions>,
    @InjectRepository(Withdrawals)
    private withdrawalsRepository: Repository<Withdrawals>,
  ) {}

  async getBalance(userId: number) {
    let userTokens = await this.userTokensRepository.findOne({ where: { userId } });
    if (!userTokens) {
      userTokens = this.userTokensRepository.create({
        userId,
        balance: 0,
        locked: 0,
        totalEarned: 0,
        totalSpent: 0,
      });
      await this.userTokensRepository.save(userTokens);
    }
    return {
      balance: Number(userTokens.balance),
      locked: Number(userTokens.locked),
      totalEarned: Number(userTokens.totalEarned),
      totalSpent: Number(userTokens.totalSpent),
    };
  }

  async addTokens(
    userId: number,
    amount: number,
    type: number,
    txHash?: string,
  ): Promise<number> {
    let userTokens = await this.userTokensRepository.findOne({ where: { userId } });
    if (!userTokens) {
      userTokens = this.userTokensRepository.create({
        userId,
        balance: 0,
        locked: 0,
        totalEarned: 0,
        totalSpent: 0,
      });
    }

    const oldBalance = Number(userTokens.balance);
    userTokens.balance = Number(userTokens.balance) + amount;
    userTokens.totalEarned = Number(userTokens.totalEarned) + amount;

    await this.userTokensRepository.save(userTokens);

    // 记录流水
    const transaction = this.tokenTransactionsRepository.create({
      userId,
      type,
      amount,
      balanceAfter: Number(userTokens.balance),
      txHash,
    });
    await this.tokenTransactionsRepository.save(transaction);

    return Number(userTokens.balance);
  }

  async deductTokens(
    userId: number,
    amount: number,
    type: number,
    txHash?: string,
  ): Promise<{ success: boolean; newBalance: number }> {
    let userTokens = await this.userTokensRepository.findOne({ where: { userId } });
    if (!userTokens || Number(userTokens.balance) < amount) {
      return { success: false, newBalance: Number(userTokens?.balance || 0) };
    }

    const oldBalance = Number(userTokens.balance);
    userTokens.balance = Number(userTokens.balance) - amount;
    userTokens.totalSpent = Number(userTokens.totalSpent) + amount;

    await this.userTokensRepository.save(userTokens);

    // 记录流水（扣减为负数）
    const transaction = this.tokenTransactionsRepository.create({
      userId,
      type,
      amount: -amount,
      balanceAfter: Number(userTokens.balance),
      txHash,
    });
    await this.tokenTransactionsRepository.save(transaction);

    return { success: true, newBalance: Number(userTokens.balance) };
  }

  async lockTokens(userId: number, amount: number): Promise<{ success: boolean }> {
    const userTokens = await this.userTokensRepository.findOne({ where: { userId } });
    if (!userTokens || Number(userTokens.balance) < amount) {
      return { success: false };
    }

    userTokens.balance = Number(userTokens.balance) - amount;
    userTokens.locked = Number(userTokens.locked) + amount;
    await this.userTokensRepository.save(userTokens);
    return { success: true };
  }

  async unlockTokens(userId: number, amount: number): Promise<{ success: boolean }> {
    const userTokens = await this.userTokensRepository.findOne({ where: { userId } });
    if (!userTokens || Number(userTokens.locked) < amount) {
      return { success: false };
    }

    userTokens.balance = Number(userTokens.balance) + amount;
    userTokens.locked = Number(userTokens.locked) - amount;
    await this.userTokensRepository.save(userTokens);
    return { success: true };
  }

  async transfer(fromUserId: number, toUserId: number, amount: number): Promise<boolean> {
    const from = await this.userTokensRepository.findOne({ where: { userId: fromUserId } });
    if (!from || Number(from.balance) < amount) {
      return false;
    }

    let to = await this.userTokensRepository.findOne({ where: { userId: toUserId } });
    if (!to) {
      to = this.userTokensRepository.create({
        userId: toUserId,
        balance: 0,
        locked: 0,
        totalEarned: 0,
        totalSpent: 0,
      });
    }

    from.balance = Number(from.balance) - amount;
    from.totalSpent = Number(from.totalSpent) + amount;
    to.balance = Number(to.balance) + amount;
    to.totalEarned = Number(to.totalEarned) + amount;

    await this.userTokensRepository.save(from);
    await this.userTokensRepository.save(to);

    // Record transactions
    this.tokenTransactionsRepository.create({
      userId: fromUserId,
      type: 9, // transfer out
      amount: -amount,
      balanceAfter: Number(from.balance),
    });
    await this.tokenTransactionsRepository.save(this.tokenTransactionsRepository.create({
      userId: toUserId,
      type: 10, // transfer in
      amount,
      balanceAfter: Number(to.balance),
    }));

    return true;
  }

  async createWithdraw(
    userId: number,
    address: string,
    amount: number,
    fee: number,
    kycLevel: number,
    riskScore: number,
  ) {
    const actualAmount = amount - fee;
    const withdrawal = this.withdrawalsRepository.create({
      userId,
      address,
      amount,
      fee,
      actualAmount,
      kycLevelSnapshot: kycLevel,
      riskScore,
    });
    await this.withdrawalsRepository.save(withdrawal);
    return { withdrawId: withdrawal.id, status: withdrawal.status };
  }

  async getWithdrawals(userId: number, status?: number) {
    const query = this.withdrawalsRepository
      .createQueryBuilder('w')
      .where('w.userId = :userId', { userId })
      .orderBy('w.createdAt', 'DESC');

    if (status !== undefined) {
      query.andWhere('w.status = :status', { status });
    }

    return query.getMany();
  }
}
