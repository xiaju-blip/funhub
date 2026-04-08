import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InviteService } from './invite.service';
import { InviteController } from './invite.controller';
import { InviteRecord } from './entities/invite-record.entity';
import { User } from '../user/entities/user.entity';
import { PointsModule } from '../points/points.module';
import { TokenModule } from '../token/token.module';

@Module({
  imports: [TypeOrmModule.forFeature([InviteRecord, User]), PointsModule, TokenModule],
  controllers: [InviteController],
  providers: [InviteService],
})
export class InviteModule {}
