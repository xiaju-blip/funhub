import { Controller, Get, Param, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AssetsService } from './assets.service';

@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get()
  getList() {
    return this.assetsService.getList();
  }

  @Get('recommend')
  getRecommend() {
    return this.assetsService.getRecommend();
  }

  @Get(':id')
  getDetail(@Param('id') id: string) {
    return this.assetsService.getDetail(Number(id));
  }

  @Post('invest')
  @UseGuards(AuthGuard('jwt'))
  invest(
    @Request() req,
    @Body() body: { assetId: number; amount: number; paymentToken: string },
  ) {
    return this.assetsService.invest(req.user.userId, body.assetId, body.amount, body.paymentToken);
  }

  @Get('my/holdings')
  @UseGuards(AuthGuard('jwt'))
  getUserHoldings(@Request() req) {
    return this.assetsService.getUserHoldings(req.user.userId);
  }
}
