import { Injectable } from '@nestjs/common';

@Injectable()
export class AssetsService {
  async getList() {
    // TODO: 实现资产列表获取
    return [];
  }

  async getDetail(id: number) {
    // TODO: 实现资产详情获取
    return null;
  }

  async getRecommend() {
    // TODO: 实现推荐资产
    return [];
  }
}
