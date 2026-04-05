import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('list')
  getList(@Request() req, @Body() body: { type?: number }) {
    return this.tasksService.getList(req.user.userId, body?.type);
  }

  @Post('claim')
  claim(@Request() req, @Body() body: { taskId: number }) {
    return this.tasksService.claim(req.user.userId, body.taskId);
  }

  @Post('claim-all')
  claimAll(@Request() req) {
    return this.tasksService.claimAll(req.user.userId);
  }
}
