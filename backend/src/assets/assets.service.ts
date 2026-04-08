import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asset } from './entities/asset.entity';
import { Position } from './entities/position.entity';
import { TokenService } from '../token/token.service';

@Injectable()
export class AssetsService {
  constructor(
    @InjectRepository(Asset)
    private assetRepository: Repository<Asset>,
    @InjectRepository(Position)
    private positionRepository: Repository<Position>,
    private tokenService: TokenService,
  ) {}

  async getList() {
    return this.assetRepository.find({
      where: { status: 1 },
      order: { createdAt: 'DESC' },
    });
  }

  async getRecommend() {
    return this.assetRepository.find({
      where: { status: 1 },
      order: { createdAt: 'DESC' },
      take: 5,
    });
  }

  async getDetail(id: number) {
    const asset = await this.assetRepository.findOne({ where: { id } });
    if (!asset) return null;

    // Get user position if logged in
    return asset;
  }

  async getUserPosition(userId: number, assetId: number) {
    return this.positionRepository.findOne({
      where: { userId, assetId },
    });
  }

  async invest(
    userId: number,
    assetId: number,
    amount: number,
    paymentToken: string,
  ) {
    const asset = await this.assetRepository.findOne({ where: { id: assetId } });
    if (!asset) {
      return { success: false, message: 'Asset not found' };
    }

    if (asset.status !== 1) {
      return { success: false, message: 'Asset not open for investment' };
    }

    const remaining = asset.targetAmount - asset.raisedAmount;
    if (amount > remaining) {
      return { success: false, message: 'Amount exceeds remaining target' };
    }

    // Deduct tokens from user
    const deducted = await this.tokenService.deductTokens(userId, amount, 2);
    if (!deducted.success) {
      return { success: false, message: 'Insufficient token balance' };
    }

    // Create or update position
    let position = await this.positionRepository.findOne({
      where: { userId, assetId },
    });

    if (position) {
      position.amount = Number(position.amount) + amount;
      await this.positionRepository.save(position);
    } else {
      position = this.positionRepository.create({
        userId,
        assetId,
        amount,
        costPrice: amount,
      });
      await this.positionRepository.save(position);
    }

    // Update raised amount
    asset.raisedAmount = Number(asset.raisedAmount) + amount;
    await this.assetRepository.save(asset);

    return {
      success: true,
      amount,
      newPosition: position,
    };
  }

  async getUserHoldings(userId: number) {
    return this.positionRepository.find({ where: { userId } });
  }
}
