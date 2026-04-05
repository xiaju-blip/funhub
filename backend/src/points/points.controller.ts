import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PointsService } from './points.service';

@Controller('points')
@UseGuards(AuthGuard('jwt'))
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  @Get('balance')
  getBalance(@Request() req) {
    return this.pointsService.getBalance(req.user.userId);
  }

  @Get('transactions')
  getTransactions(@Request() req) {
    return this.pointsService.getTransactions(req.user.userId);
  }
}
