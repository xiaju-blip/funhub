import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { VipService } from './vip.service';

@Controller('vip')
export class VipController {
  constructor(private readonly vipService: VipService) {}

  @Get('levels')
  getLevels() {
    return this.vipService.getLevels();
  }

  @Get('my-level')
  @UseGuards(AuthGuard('jwt'))
  getMyLevel(@Request() req) {
    return this.vipService.getUserVipLevel(req.user.userId);
  }
}
