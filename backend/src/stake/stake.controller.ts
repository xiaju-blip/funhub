import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { StakeService } from './stake.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';

@Controller('stake')
@UseGuards(AuthGuard('jwt'))
export class StakeController {
  constructor(
    private readonly stakeService: StakeService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

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
  async deposit(@Request() req, @Body() body: { poolId: number; amount: number }) {
    const user = await this.userRepository.findOne({ where: { id: req.user.userId } });
    return this.stakeService.deposit(req.user.userId, body.poolId, body.amount, user.vipLevel);
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
