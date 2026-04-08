import { Controller, Get, Post, Body, UseGuards, Request, Delete, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TradeService } from './trade.service';

@Controller('trade')
export class TradeController {
  constructor(private readonly tradeService: TradeService) {}

  @Get('orderbook')
  getOrderBook() {
    return this.tradeService.getOrderBook();
  }

  @Get('history')
  getTradeHistory() {
    return this.tradeService.getTradeHistory();
  }

  @Get('my-orders')
  @UseGuards(AuthGuard('jwt'))
  getMyOrders(@Request() req) {
    return this.tradeService.getMyOrders(req.user.userId);
  }

  @Post('place')
  @UseGuards(AuthGuard('jwt'))
  placeOrder(
    @Request() req,
    @Body() body: { type: number; amount: number; price: number },
  ) {
    return this.tradeService.placeOrder(req.user.userId, body.type, body.amount, body.price);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  cancelOrder(@Request() req, @Param('id') id: string) {
    return this.tradeService.cancelOrder(req.user.userId, Number(id));
  }
}
