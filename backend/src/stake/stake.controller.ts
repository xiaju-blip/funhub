import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { StakeService } from './stake.service';

@Controller('stake')
@UseGuards(AuthGuard('jwt'))
export class StakeController {
  constructor(private readonly stakeService: StakeService) {}

  @Get('overview')
  getOverview() {
    return this.stakeService.getOverview();
  }

  @Get('pools')
  getPools() {
    return this.stakeService.getPools();
  }

  @Get('my')
  getMyStake(@Request() req) {
    return this.stakeService.getMyStake(req.user.userId);
  }

  @Post('deposit')
  deposit(@Request() req, @Body() body: { poolId: number; amount: number }) {
    return this.stakeService.deposit(req.user.userId, body.poolId, body.amount);
  }

  @Post('claim')
  claim(@Request() req, @Body() body: { stakeId: number }) {
    return this.stakeService.claim(req.user.userId, body.stakeId);
  }

  @Post('withdraw')
  withdraw(@Request() req, @Body() body: { stakeId: number }) {
    return this.stakeService.withdraw(req.user.userId, body.stakeId);
  }
}
