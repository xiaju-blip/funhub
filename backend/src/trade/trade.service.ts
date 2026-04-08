import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { TradeOrder } from './entities/order.entity';
import { TradeHistory } from './entities/trade-history.entity';
import { TokenService } from '../token/token.service';
import { LessThanOrEqual } from 'typeorm';

@Injectable()
export class TradeService {
  constructor(
    @InjectRepository(TradeOrder)
    private orderRepository: Repository<TradeOrder>,
    @InjectRepository(TradeHistory)
    private historyRepository: Repository<TradeHistory>,
    private tokenService: TokenService,
  ) {}

  // Fee rate: 0.25%
  private readonly FEE_RATE = 0.0025;

  async getOrderBook() {
    const bids = await this.orderRepository.find({
      where: { type: 1, status: LessThanOrEqual(2) }, // buy
      order: { price: 'DESC' },
      take: 20,
    });
    const asks = await this.orderRepository.find({
      where: { type: 2, status: LessThanOrEqual(2) }, // sell
      order: { price: 'ASC' },
      take: 20,
    });

    // Aggregate by price
    const aggregatedBids = this.aggregateOrders(bids);
    const aggregatedAsks = this.aggregateOrders(asks);

    return { bids: aggregatedBids, asks: aggregatedAsks };
  }

  private aggregateOrders(orders: TradeOrder[]) {
    const map = new Map<number, number>();
    orders.forEach(o => {
      const remaining = Number(o.amount) - Number(o.filledAmount);
      if (remaining > 0) {
        const current = map.get(Number(o.price)) || 0;
        map.set(Number(o.price), current + remaining);
      }
    });
    return Array.from(map.entries()).map(([price, amount]) => ({ price, amount }));
  }

  async getMyOrders(userId: number) {
    return this.orderRepository.find({
      where: { makerId: userId },
      order: { createdAt: 'DESC' },
    });
  }

  async placeOrder(userId: number, type: number, amount: number, price: number) {
    // Check balance
    if (type === 2) { // sell
      const balance = await this.tokenService.getBalance(userId);
      if (balance.balance < amount) {
        return { success: false, message: 'Insufficient token balance' };
      }
      // Lock tokens
      const locked = await this.tokenService.lockTokens(userId, amount);
      if (!locked.success) {
        return { success: false, message: 'Lock failed' };
      }
    }
    // For buy buyer needs to have USD? In this system it's all tokens, so for simplicity we skip for now

    const order = this.orderRepository.create({
      makerId: userId,
      type,
      amount,
      price,
      filledAmount: 0,
      status: 1,
    });
    await this.orderRepository.save(order);

    // Try matching with existing opposite orders
    await this.matchOrders();

    return { success: true, orderId: order.id };
  }

  private async matchOrders() {
    // Find best bid and best ask
    const bestBid = await this.orderRepository.findOne({
      where: { type: 1, status: 1 },
      order: { price: 'DESC' },
    });
    const bestAsk = await this.orderRepository.findOne({
      where: { type: 2, status: 1 },
      order: { price: 'ASC' },
    });

    if (!bestBid || !bestAsk) return;

    // If bid price >= ask price -> match
    if (Number(bestBid.price) >= Number(bestAsk.price)) {
      const matchPrice = Number(bestAsk.price);
      const bidRemaining = Number(bestBid.amount) - Number(bestBid.filledAmount);
      const askRemaining = Number(bestAsk.amount) - Number(bestAsk.filledAmount);
      const tradedAmount = Math.min(bidRemaining, askRemaining);

      // Execute trade
      await this.executeTrade(bestBid, bestAsk, tradedAmount, matchPrice);
    }
  }

  private async executeTrade(
    bidOrder: TradeOrder,
    askOrder: TradeOrder,
    amount: number,
    price: number,
  ) {
    const total = amount * price;
    const buyer = bidOrder.makerId; // bid is buy
    const seller = askOrder.makerId; // ask is sell

    // Calculate fees
    const buyerFee = amount * this.FEE_RATE;
    const sellerFee = (amount * price) * this.FEE_RATE;

    // Transfer tokens from seller to buyer
    await this.tokenService.unlockTokens(seller, amount - buyerFee);
    await this.tokenService.transfer(seller, buyer, amount - buyerFee);

    // Transfer USDT equivalent from buyer to seller
    // For simplicity in this system all is token, just transfer value
    // In real world this would be stable coin

    // Record history
    let history = this.historyRepository.create({
      orderId: bidOrder.id,
      makerId: bidOrder.makerId,
      takerId: askOrder.makerId,
      type: 1,
      amount,
      price,
      fee: buyerFee,
    });
    await this.historyRepository.save(history);

    history = this.historyRepository.create({
      orderId: askOrder.id,
      makerId: askOrder.makerId,
      takerId: bidOrder.makerId,
      type: 2,
      amount,
      price,
      fee: sellerFee,
    });
    await this.historyRepository.save(history);

    // Update orders
    bidOrder.filledAmount = Number(bidOrder.filledAmount) + amount;
    askOrder.filledAmount = Number(askOrder.filledAmount) + amount;

    if (Number(bidOrder.filledAmount) >= Number(bidOrder.amount)) {
      bidOrder.status = 3; // filled
    } else {
      bidOrder.status = 2; // partial
    }
    if (Number(askOrder.filledAmount) >= Number(askOrder.amount)) {
      askOrder.status = 3; // filled
    } else {
      askOrder.status = 2; // partial
    }

    await this.orderRepository.save(bidOrder);
    await this.orderRepository.save(askOrder);
  }

  async cancelOrder(userId: number, orderId: number) {
    const order = await this.orderRepository.findOne({ where: { id: orderId, makerId: userId } });
    if (!order) return { success: false, message: 'Order not found' };
    if (order.status > 2) return { success: false, message: 'Order already filled or canceled' };

    // Unlock locked tokens if it's a sell order
    if (order.type === 2) {
      const remaining = Number(order.amount) - Number(order.filledAmount);
      if (remaining > 0) {
        await this.tokenService.unlockTokens(userId, remaining);
      }
    }

    order.status = 4;
    await this.orderRepository.save(order);
    return { success: true };
  }

  async getTradeHistory(limit = 50) {
    return this.historyRepository.find({
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}
