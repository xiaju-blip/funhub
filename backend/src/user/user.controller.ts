import { Controller, Get, Patch, Body, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';

@UseGuards(AuthGuard('jwt'))
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  getProfile(@Request() req) {
    return this.userService.findById(req.user.userId);
  }

  @Patch('language')
  updateLanguage(@Request() req, @Body() body: { language: string }) {
    return this.userService.updateLanguage(req.user.userId, body.language);
  }

  @Patch('profile')
  updateProfile(@Request() req, @Body() body: Partial<any>) {
    return this.userService.updateProfile(req.user.userId, body);
  }
}
