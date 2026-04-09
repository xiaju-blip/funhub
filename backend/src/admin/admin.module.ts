import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Asset } from '../assets/entities/asset.entity';
import { Drama } from '../drama/entities/drama.entity';
import { Withdrawals } from '../token/entities/withdrawals.entity';
import { Task } from '../tasks/entities/task.entity';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AdminRoleGuard } from './admin-role.guard';

@Module({
  imports: [TypeOrmModule.forFeature([User, Asset, Drama, Withdrawals, Task])],
  controllers: [AdminController],
  providers: [AdminService, AdminRoleGuard],
})
export class AdminModule {}
