import { Controller, Get, Post, Put, Delete, Query, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(AuthGuard('jwt'))
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // 数据看板
  @Get('dashboard')
  getDashboard() {
    return this.adminService.getDashboard();
  }

  // ========== 用户管理 ==========
  @Get('users')
  getUsers(@Query('page') page: string, @Query('limit') limit: string) {
    return this.adminService.getUsers(Number(page), Number(limit));
  }

  @Put('users/:id/kyc')
  updateKyc(@Body() body: { id: number; level: number }) {
    return this.adminService.updateKyc(body.id, body.level);
  }

  @Put('users/:id/status')
  updateStatus(@Body() body: { id: number; status: number }) {
    return this.adminService.updateStatus(body.id, body.status);
  }

  // ========== 资产管理 ==========
  @Get('assets')
  getAssets() {
    return this.adminService.getAssets();
  }

  @Post('assets')
  createAsset(@Body() body: any) {
    return this.adminService.createAsset(body);
  }

  @Put('assets/:id')
  updateAsset(@Body() body: any) {
    return this.adminService.updateAsset(body);
  }

  @Delete('assets/:id')
  deleteAsset(@Body() body: { id: number }) {
    return this.adminService.deleteAsset(body.id);
  }

  // ========== 内容管理 ==========
  @Get('dramas')
  getDramas() {
    return this.adminService.getDramas();
  }

  @Post('dramas')
  createDrama(@Body() body: any) {
    return this.adminService.createDrama(body);
  }

  @Put('dramas/:id')
  updateDrama(@Body() body: any) {
    return this.adminService.updateDrama(body);
  }

  // ========== 交易风控 ==========
  @Get('withdrawals')
  getWithdrawals(@Query('status') status: string) {
    return this.adminService.getWithdrawals(Number(status));
  }

  @Post('withdrawals/:id/approve')
  approveWithdrawal(@Body() body: { id: number; auditRemark: string }) {
    return this.adminService.approveWithdrawal(body.id, body.auditRemark);
  }

  @Post('withdrawals/:id/reject')
  rejectWithdrawal(@Body() body: { id: number; rejectReason: string }) {
    return this.adminService.rejectWithdrawal(body.id, body.rejectReason);
  }

  // ========== 任务管理 ==========
  @Get('tasks')
  getTasks() {
    return this.adminService.getTasks();
  }

  @Post('tasks')
  createTask(@Body() body: any) {
    return this.adminService.createTask(body);
  }

  @Put('tasks/:id/status')
  updateTaskStatus(@Body() body: { id: number; status: number }) {
    return this.adminService.updateTaskStatus(body.id, body.status);
  }
}
