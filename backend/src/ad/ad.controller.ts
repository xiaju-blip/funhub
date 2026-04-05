import { Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdService } from './ad.service';

@Controller('ad')
@UseGuards(AuthGuard('jwt'))
export class AdController {
  constructor(private readonly adService: AdService) {}

  @Get('config')
  getConfig() {
    return this.adService.getAdConfig();
  }

  @Post('impression')
  recordImpression(@Request() req, @Body() body: any) {
    return this.adService.recordImpression(req.user.userId, body);
  }

  @Post('click')
  recordClick(@Request() req, @Body() body: any) {
    return this.adService.recordClick(req.user.userId, body);
  }
}
