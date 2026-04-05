import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

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
