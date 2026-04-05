import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findById(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) return null;
    const { passwordHash, ...result } = user;
    return result;
  }

  async updateLanguage(userId: number, language: string) {
    await this.userRepository.update(userId, { language });
    return { success: true };
  }

  async updateProfile(userId: number, data: Partial<User>) {
    await this.userRepository.update(userId, data);
    return { success: true };
  }
}
