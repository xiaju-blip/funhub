import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-code')
  sendCode(@Body() body: { to: string; type: 'email' | 'phone' }) {
    return this.authService.sendCode(body.to, body.type);
  }

  @Post('register')
  register(@Body() body: {
    email?: string;
    phone?: string;
    code: string;
    password: string;
    inviteCode?: string;
  }) {
    return this.authService.register(body);
  }

  @Post('login/email')
  loginEmail(@Body() body: { email: string; password: string }) {
    return this.authService.loginEmail(body.email, body.password);
  }

  @Post('login/phone')
  loginPhone(@Body() body: { phone: string; code: string }) {
    return this.authService.loginPhone(body.phone, body.code);
  }

  @Post('login/wallet')
  loginWallet(@Body() body: { address: string; signature: string }) {
    return this.authService.loginWallet(body.address, body.signature);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {
    // Handled by passport
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleCallback(@Req() req) {
    return this.authService.googleLogin(req);
  }

  @Post('reset-password')
  resetPassword(@Body() body: {
    emailOrPhone: string;
    code: string;
    newPassword: string;
  }) {
    // TODO: 实现重置密码
    return { success: true };
  }
}
