import { Controller, Get, Param } from '@nestjs/common';
import { AssetsService } from './assets.service';

@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get()
  getList() {
    return this.assetsService.getList();
  }

  @Get(':id')
  getDetail(@Param('id') id: string) {
    return this.assetsService.getDetail(Number(id));
  }
}
