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
import { AdminModule } from './admin/admin.module';
import { TokenModule } from './token/token.module';
import { ShopModule } from './shop/shop.module';
import { VipModule } from './vip/vip.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get('DATABASE_URL');
        if (databaseUrl) {
          // If DATABASE_URL is provided (Railway, etc.), use it directly
          const config: any = {
            type: 'postgres',
            url: databaseUrl,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: configService.get<boolean>('DB_SYNC', false),
            ssl: {
              rejectUnauthorized: false,
            },
          };
          return config;
        }
        // Fallback to individual config
        const config: any = {
          type: 'postgres',
          host: configService.get('DB_HOST', 'localhost'),
          port: configService.get<number>('DB_PORT', 5432),
          username: configService.get('DB_USERNAME', 'reelrwa'),
          password: configService.get('DB_PASSWORD', 'reelrwa_password'),
          database: configService.get('DB_DATABASE', 'reelrwa'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: configService.get<boolean>('DB_SYNC', false),
        };
        if (configService.get<boolean>('DB_SSL', false)) {
          config.ssl = {
            rejectUnauthorized: false,
          };
        }
        return config;
      },
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
    AdminModule,
    TokenModule,
    ShopModule,
    VipModule,
  ],
})
export class AppModule {}
