import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShopProduct } from './entities/product.entity';
import { ShopOrder } from './entities/order.entity';
import { PointsService } from '../points/points.service';
import { TokenService } from '../token/token.service';

@Injectable()
export class ShopService {
  constructor(
    @InjectRepository(ShopProduct)
    private productRepository: Repository<ShopProduct>,
    @InjectRepository(ShopOrder)
    private orderRepository: Repository<ShopOrder>,
    private pointsService: PointsService,
    private tokenService: TokenService,
  ) {}

  async getList(category?: string) {
    const where: any = { status: 1 };
    if (category) {
      where.category = category;
    }
    return this.productRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  async exchange(
    userId: number,
    productId: number,
    quantity: number,
    shippingAddress?: string,
    contactPhone?: string,
  ) {
    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product || product.status !== 1) {
      return { success: false, message: 'Product not available' };
    }

    if (product.stock < quantity) {
      return { success: false, message: 'Insufficient stock' };
    }

    const totalPoints = product.pointsRequired * quantity;
    const totalToken = (product.tokenRequired || 0) * quantity;

    // Check balance
    const pointBalance = await this.pointsService.getBalance(userId);
    if (pointBalance.balance < totalPoints) {
      return { success: false, message: 'Insufficient points balance' };
    }
    if (totalToken > 0) {
      const tokenBalance = await this.tokenService.getBalance(userId);
      if (tokenBalance.balance < totalToken) {
        return { success: false, message: 'Insufficient token balance' };
      }
    }

    // Deduct
    if (totalPoints > 0) {
      const deducted = await this.pointsService.deductPoints(userId, totalPoints, 8, productId.toString());
      if (!deducted.success) {
        return { success: false, message: 'Points deduction failed' };
      }
    }
    if (totalToken > 0) {
      const deducted = await this.tokenService.deductTokens(userId, totalToken, 8);
      if (!deducted.success) {
        return { success: false, message: 'Token deduction failed' };
      }
    }

    // Decrease stock
    product.stock -= quantity;
    await this.productRepository.save(product);

    // Create order
    const order = this.orderRepository.create({
      userId,
      productId,
      quantity,
      pointsPaid: totalPoints,
      tokenPaid: totalToken,
      status: 1,
      shippingAddress: shippingAddress || null,
      contactPhone: contactPhone || null,
    });
    await this.orderRepository.save(order);

    return { success: true, orderId: order.id };
  }

  async getMyOrders(userId: number) {
    return this.orderRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }
}
