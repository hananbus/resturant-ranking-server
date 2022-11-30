import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ResturantModule } from './resturant/resturant.module';
import { RankModule } from './rank/rank.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal:true
  }),AuthModule, UserModule, ResturantModule, RankModule, PrismaModule],
})
export class AppModule {}
