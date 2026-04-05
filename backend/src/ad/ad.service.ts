import { Injectable } from '@nestjs/common';

@Injectable()
export class AdService {
  async getAdConfig() {
    // TODO: 获取广告配置，返回各广告位的 SDK 信息
    return [];
  }

  async recordImpression(userId: number, data: any) {
    // TODO: 记录广告展示
    return { success: true };
  }

  async recordClick(userId: number, data: any) {
    // TODO: 记录广告点击，发放积分
    return { success: true, pointsEarned: 5 };
  }
}
