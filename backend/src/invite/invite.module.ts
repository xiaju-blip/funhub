import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InviteService } from './invite.service';
import { InviteController } from './invite.controller';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [InviteController],
  providers: [InviteService],
})
export class InviteModule {}
