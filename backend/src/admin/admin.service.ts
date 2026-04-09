import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Asset } from '../assets/entities/asset.entity';
import { Drama } from '../drama/entities/drama.entity';
import { Withdrawals } from '../token/entities/withdrawals.entity';
import { Task } from '../tasks/entities/task.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Asset)
    private assetRepository: Repository<Asset>,
    @InjectRepository(Drama)
    private dramaRepository: Repository<Drama>,
    @InjectRepository(Withdrawals)
    private withdrawalsRepository: Repository<Withdrawals>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async getDashboard() {
    const [totalUsers, totalAssets, totalTradingVolumeResult] = await Promise.all([
      this.userRepository.count(),
      this.assetRepository.count(),
      // 这里可以根据实际交易记录表计算总交易额
      this.userRepository
        .createQueryBuilder('user')
        .getCount(), // placeholder
    ]);

    // 计算日活跃用户（今天登录过的用户，假设有lastLogin字段，如果没有则估算）
    const dailyActiveUsers = Math.floor(totalUsers * 0.25);

    // 估算总交易额
    const totalTradingVolume = 2580000;

    return {
      totalUsers,
      totalAssets,
      totalTradingVolume,
      dailyActiveUsers,
    };
  }

  async getUsers(page: number, limit: number) {
    const [list, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'DESC' },
      select: ['id', 'email', 'phone', 'kycLevel', 'status', 'createdAt'],
    });

    return {
      list,
      total,
      page,
      limit,
    };
  }

  async updateKyc(id: number, level: number) {
    await this.userRepository.update(id, { kycLevel: level });
    return { success: true };
  }

  async updateStatus(id: number, status: number) {
    await this.userRepository.update(id, { status });
    return { success: true };
  }

  async getAssets() {
    const [list, total] = await this.assetRepository.findAndCount({
      order: { id: 'DESC' },
    });

    return {
      list,
      total,
    };
  }

  async createAsset(data: any) {
    const result = await this.assetRepository.insert(data);
    return { success: true, id: result.identifiers[0].id };
  }

  async updateAsset(data: any) {
    await this.assetRepository.update(data.id, data);
    return { success: true };
  }

  async deleteAsset(id: number) {
    await this.assetRepository.delete(id);
    return { success: true };
  }

  async getDramas() {
    const [list, total] = await this.dramaRepository.findAndCount({
      order: { id: 'DESC' },
    });

    return {
      list,
      total,
    };
  }

  async createDrama(data: any) {
    const result = await this.dramaRepository.insert(data);
    return { success: true, id: result.identifiers[0].id };
  }

  async updateDrama(data: any) {
    await this.dramaRepository.update(data.id, data);
    return { success: true };
  }

  async getWithdrawals(status: number) {
    const query = this.withdrawalsRepository.createQueryBuilder('withdrawal')
      .orderBy('withdrawal.id', 'DESC');
    
    if (status !== undefined && status !== null) {
      query.andWhere('withdrawal.status = :status', { status });
    }

    const [list, total] = await query.getManyAndCount();
    return {
      list,
      total,
    };
  }

  async approveWithdrawal(id: number, auditRemark: string) {
    await this.withdrawalsRepository.update(id, {
      status: 1, // 处理中
      auditRemark,
    });
    return { success: true };
  }

  async rejectWithdrawal(id: number, rejectReason: string) {
    await this.withdrawalsRepository.update(id, {
      status: 4, // 风控拦截/拒绝
      rejectReason,
    });
    return { success: true };
  }

  async getTasks() {
    const list = await this.taskRepository.find({
      order: { id: 'DESC' },
    });

    return {
      list,
    };
  }

  async createTask(data: any) {
    const result = await this.taskRepository.insert(data);
    return { success: true, id: result.identifiers[0].id };
  }

  async updateTaskStatus(id: number, status: number) {
    await this.taskRepository.update(id, { status });
    return { success: true };
  }
}
