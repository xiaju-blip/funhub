import { Injectable } from '@nestjs/common';

@Injectable()
export class DramaService {
  async getHotList() {
    // TODO: 实现获取热门短剧列表
    return [];
  }

  async getEpisodes(dramaId: number) {
    // TODO: 实现获取剧集列表
    return [];
  }
}
