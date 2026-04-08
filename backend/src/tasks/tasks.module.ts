import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Task } from './entities/task.entity';
import { UserTask } from './entities/user-task.entity';
import { PointsModule } from '../points/points.module';
import { TokenModule } from '../token/token.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task, UserTask]), PointsModule, TokenModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
