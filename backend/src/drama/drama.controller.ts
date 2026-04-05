import { Controller, Get, Param } from '@nestjs/common';
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
}
