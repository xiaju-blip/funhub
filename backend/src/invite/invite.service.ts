import { Injectable } from '@nestjs/common';

@Injectable()
export class InviteService {
  async getMyCode(userId: number) {
    // TODO: 获取我的邀请码
    return { code: '', link: '', qrCodeUrl: '' };
  }

  async getStats(userId: number) {
    // TODO: 获取邀请统计
    return { directCount: 0, indirectCount: 0, totalReward: 0 };
  }

  async getRecords(userId: number) {
    // TODO: 获取邀请明细
    return [];
  }

  async bindInvite(userId: number, inviteCode: string) {
    // TODO: 绑定邀请码
    return { success: true };
  }
}
