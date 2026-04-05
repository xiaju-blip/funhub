import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../user/entities/user.entity';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async sendCode(emailOrPhone: string, type: 'email' | 'phone') {
    // TODO: 发送验证码逻辑，集成短信/邮件服务商
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    // 存储验证码到 Redis，过期时间 5 分钟
    console.log(`Send code ${code} to ${emailOrPhone}`);
    return { success: true, expireTime: Date.now() + 5 * 60 * 1000 };
  }

  async register(data: {
    email?: string;
    phone?: string;
    code: string;
    password: string;
    inviteCode?: string;
  }) {
    const { email, phone, password } = data;

    // 检查是否已注册
    if (email) {
      const existing = await this.userRepository.findOne({ where: { email } });
      if (existing) {
        throw new BadRequestException('Email already registered');
      }
    }
    if (phone) {
      const existing = await this.userRepository.findOne({ where: { phone } });
      if (existing) {
        throw new BadRequestException('Phone already registered');
      }
    }

    // 生成邀请码
    const inviteCode = randomBytes(8).toString('hex').slice(0, 8);

    // 加密密码
    const passwordHash = await bcrypt.hash(password, 10);

    // 创建用户
    const user = this.userRepository.create({
      email,
      phone,
      passwordHash,
      inviteCode,
      // TODO: 处理邀请人关系
    });

    await this.userRepository.save(user);

    // 生成 JWT
    const token = this.generateToken(user);

    return {
      token,
      userInfo: this.sanitizeUser(user),
    };
  }

  async loginEmail(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status !== 1) {
      throw new UnauthorizedException('Account disabled');
    }

    const token = this.generateToken(user);
    return {
      token,
      userInfo: this.sanitizeUser(user),
    };
  }

  async loginPhone(phone: string, code: string) {
    // TODO: 验证码校验
    const user = await this.userRepository.findOne({ where: { phone } });
    if (!user) {
      throw new UnauthorizedException('Invalid phone');
    }

    if (user.status !== 1) {
      throw new UnauthorizedException('Account disabled');
    }

    const token = this.generateToken(user);
    return {
      token,
      userInfo: this.sanitizeUser(user),
    };
  }

  async loginWallet(address: string, signature: string) {
    // TODO: 签名验证
    let user = await this.userRepository.findOne({ where: { walletAddress: address } });

    if (!user) {
      // 新用户通过钱包自动注册
      const inviteCode = randomBytes(8).toString('hex').slice(0, 8);
      user = this.userRepository.create({
        walletAddress: address,
        inviteCode,
      });
      await this.userRepository.save(user);
    }

    if (user.status !== 1) {
      throw new UnauthorizedException('Account disabled');
    }

    const token = this.generateToken(user);
    return {
      token,
      userInfo: this.sanitizeUser(user),
    };
  }

  private generateToken(user: User) {
    const payload = { sub: user.id, email: user.email };
    return this.jwtService.sign(payload);
  }

  private sanitizeUser(user: User) {
    const { passwordHash, ...result } = user;
    return result;
  }
}
