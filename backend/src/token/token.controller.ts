import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TokenService } from './token.service';

@Controller('token')
@UseGuards(AuthGuard('jwt'))
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Get('balance')
  getBalance(@Request() req) {
    return this.tokenService.getBalance(req.user.userId);
  }

  @Get('transactions')
  getTransactions(@Request() req) {
    return this.tokenService.getBalance(req.user.userId);
  }

  @Post('withdraw')
  withdraw(
    @Request() req,
    @Body() body: { address: string; amount: number; fee: number; kycLevel: number; riskScore: number },
  ) {
    return this.tokenService.createWithdraw(
      req.user.userId,
      body.address,
      body.amount,
      body.fee,
      body.kycLevel,
      body.riskScore,
    );
  }

  @Get('withdrawals')
  getWithdrawals(@Request() req, @Body() body: { status?: number }) {
    return this.tokenService.getWithdrawals(req.user.userId, body.status);
  }
}
