import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { UserTask } from './entities/user-task.entity';
import { PointsService } from '../points/points.service';
import { TokenService } from '../token/token.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(UserTask)
    private userTaskRepository: Repository<UserTask>,
    private pointsService: PointsService,
    private tokenService: TokenService,
  ) {}

  async getList(userId: number, type?: number) {
    const query = this.taskRepository
      .createQueryBuilder('t')
      .where('t.status = 1');

    if (type !== undefined) {
      query.andWhere('t.type = :type', { type });
    }

    const tasks = await query.orderBy('t.sortOrder', 'ASC').getMany();

    // Join user progress
    const result = await Promise.all(
      tasks.map(async (task) => {
        const userTask = await this.userTaskRepository.findOne({
          where: { userId, taskId: task.id },
        });
        return {
          ...task,
          progress: userTask?.progress || 0,
          status: userTask?.status || 0,
          target: task.conditionValue ? parseInt(task.conditionValue, 10) : null,
          canClaim: userTask?.status === 2,
        };
      }),
    );

    return result;
  }

  async claim(userId: number, taskId: number) {
    const task = await this.taskRepository.findOne({ where: { id: taskId } });
    if (!task) {
      return { success: false, message: 'Task not found' };
    }

    const userTask = await this.userTaskRepository.findOne({
      where: { userId, taskId },
    });

    if (!userTask || userTask.status !== 2) {
      return { success: false, message: 'Task not ready for claim' };
    }

    // 发放奖励
    if (task.rewardPoints > 0) {
      await this.pointsService.addPoints(userId, task.rewardPoints, 6, task.id.toString());
    }
    if (Number(task.rewardToken) > 0) {
      await this.tokenService.addTokens(userId, Number(task.rewardToken), 6, null);
    }

    // 更新状态
    userTask.status = 3;
    userTask.claimedAt = new Date();
    await this.userTaskRepository.save(userTask);

    return {
      success: true,
      pointsEarned: task.rewardPoints,
      tokenEarned: task.rewardToken,
    };
  }

  async claimAll(userId: number) {
    const pendingTasks = await this.userTaskRepository
      .createQueryBuilder('ut')
      .where('ut.userId = :userId', { userId })
      .andWhere('ut.status = 2', { userId })
      .getMany();

    let totalPoints = 0;
    let totalToken = 0;

    for (const ut of pendingTasks) {
      const task = await this.taskRepository.findOne({ where: { id: ut.taskId } });
      if (task && task.rewardPoints > 0) {
        await this.pointsService.addPoints(userId, task.rewardPoints, 6, task.id.toString());
        totalPoints += task.rewardPoints;
      }
      if (task && Number(task.rewardToken) > 0) {
        await this.tokenService.addTokens(userId, Number(task.rewardToken), 6, null);
        totalToken += Number(task.rewardToken);
      }
      ut.status = 3;
      ut.claimedAt = new Date();
      await this.userTaskRepository.save(ut);
    }

    return { totalPoints, totalToken };
  }

  async updateProgress(userId: number, taskId: number, progress: number) {
    let userTask = await this.userTaskRepository.findOne({
      where: { userId, taskId },
    });

    const task = await this.taskRepository.findOne({ where: { id: taskId } });
    if (!task) return;

    if (!userTask) {
      userTask = this.userTaskRepository.create({ userId, taskId, progress, status: 1 });
    } else {
      userTask.progress = progress;
    }

    const target = task.conditionValue ? parseInt(task.conditionValue, 10) : 0;
    if (target > 0 && progress >= target && userTask.status !== 3) {
      userTask.status = 2; // 可领取
    }

    await this.userTaskRepository.save(userTask);
  }
}
