import { Module } from '@nestjs/common';
import { ResturantService } from './resturant.service';
import { ResturantController } from './resturant.controller';

@Module({
  providers: [ResturantService],
  controllers: [ResturantController]
})
export class ResturantModule {}
