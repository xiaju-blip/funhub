import { Injectable } from '@nestjs/common';

@Injectable()
export class TasksService {
  async getList(userId: number, type?: number) {
    // TODO: 获取任务列表
    return [];
  }

  async claim(userId: number, taskId: number) {
    // TODO: 领取任务奖励
    return { success: true, pointsEarned: 0, tokenEarned: 0 };
  }

  async claimAll(userId: number) {
    // TODO: 一键领取所有可领取奖励
    return { totalPoints: 0, totalToken: 0 };
  }
}
