import { Controller, Get, Param, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DramaService } from './drama.service';

@Controller('dramas')
export class DramaController {
  constructor(private readonly dramaService: DramaService) {}

  @Get('hot')
  getHotList() {
    return this.dramaService.getHotList();
  }

  @Get(':id/episodes')
  getEpisodes(@Param('id') id: string) {
    return this.dramaService.getEpisodes(Number(id));
  }

  @Get(':id')
  getDetail(@Param('id') id: string) {
    return this.dramaService.getDetail(Number(id));
  }

  @Post(':id/episode/:episodeId/watch')
  @UseGuards(AuthGuard('jwt'))
  recordWatch(
    @Request() req,
    @Param('id') id: string,
    @Param('episodeId') episodeId: string,
    @Body() body: {
      duration: number;
      isCompleted: boolean;
      hasInteraction: boolean;
      deviceFingerprint: string;
      ipAddress: string;
    },
  ) {
    return this.dramaService.recordWatch(
      req.user.userId,
      Number(id),
      Number(episodeId),
      body.duration,
      body.isCompleted,
      body.hasInteraction,
      body.deviceFingerprint,
      body.ipAddress,
    );
  }

  @Get('check/daily-free-limit')
  @UseGuards(AuthGuard('jwt'))
  checkDailyFreeLimit(@Request() req) {
    return this.dramaService.checkDailyFreeLimit(req.user.userId);
  }
}
