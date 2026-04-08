import { Controller, Get, Post, Body, UseGuards, Request, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ShopService } from './shop.service';

@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Get('products')
  getProducts(@Query('category') category?: string) {
    return this.shopService.getList(category);
  }

  @Post('exchange')
  @UseGuards(AuthGuard('jwt'))
  exchange(
    @Request() req,
    @Body() body: {
      productId: number;
      quantity: number;
      shippingAddress?: string;
      contactPhone?: string;
    },
  ) {
    return this.shopService.exchange(
      req.user.userId,
      body.productId,
      body.quantity,
      body.shippingAddress,
      body.contactPhone,
    );
  }

  @Get('my-orders')
  @UseGuards(AuthGuard('jwt'))
  getMyOrders(@Request() req) {
    return this.shopService.getMyOrders(req.user.userId);
  }
}
