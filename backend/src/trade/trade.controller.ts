import { Controller, Get, Post, Body, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TradeService } from './trade.service';

@Controller('orders')
@UseGuards(AuthGuard('jwt'))
export class TradeController {
  constructor(private readonly tradeService: TradeService) {}

  @Get('book')
  getOrderBook(@Query('assetId') assetId: string) {
    return this.tradeService.getOrderBook(Number(assetId));
  }

  @Post()
  placeOrder(@Request() req, @Body() body: any) {
    return this.tradeService.placeOrder(req.user.userId, body);
  }

  @Get('my')
  getMyOrders(@Request() req) {
    return this.tradeService.getMyOrders(req.user.userId);
  }
}
