import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { DramaModule } from './drama/drama.module';
import { AssetsModule } from './assets/assets.module';
import { TradeModule } from './trade/trade.module';
import { PointsModule } from './points/points.module';
import { StakeModule } from './stake/stake.module';
import { TasksModule } from './tasks/tasks.module';
import { AdModule } from './ad/ad.module';
import { InviteModule } from './invite/invite.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'reelrwa'),
        password: configService.get('DB_PASSWORD', 'reelrwa_password'),
        database: configService.get('DB_DATABASE', 'reelrwa'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get<boolean>('DB_SYNC', false),
        ssl: configService.get<boolean>('DB_SSL', false),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    DramaModule,
    AssetsModule,
    TradeModule,
    PointsModule,
    StakeModule,
    TasksModule,
    AdModule,
    InviteModule,
  ],
})
export class AppModule {}
