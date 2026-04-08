import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopService } from './shop.service';
import { ShopController } from './shop.controller';
import { ShopProduct } from './entities/product.entity';
import { ShopOrder } from './entities/order.entity';
import { PointsModule } from '../points/points.module';
import { TokenModule } from '../token/token.module';

@Module({
  imports: [TypeOrmModule.forFeature([ShopProduct, ShopOrder]), PointsModule, TokenModule],
  controllers: [ShopController],
  providers: [ShopService],
})
export class ShopModule {}
