import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InviteService } from './invite.service';

@Controller('invite')
@UseGuards(AuthGuard('jwt'))
export class InviteController {
  constructor(private readonly inviteService: InviteService) {}

  @Get('code')
  getCode(@Request() req) {
    return this.inviteService.getMyCode(req.user.userId);
  }

  @Get('stats')
  getStats(@Request() req) {
    return this.inviteService.getStats(req.user.userId);
  }

  @Get('records')
  getRecords(@Request() req) {
    return this.inviteService.getRecords(req.user.userId);
  }

  @Post('bind')
  bindInvite(@Request() req, @Body() body: { inviteCode: string }) {
    return this.inviteService.bindInvite(req.user.userId, body.inviteCode);
  }
}
