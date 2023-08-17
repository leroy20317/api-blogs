import { Module } from '@nestjs/common';
import Controller from './controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { ClashRule, ClashType, ClashMode } from './model';
import Service from './service';

@Module({
  imports: [TypegooseModule.forFeature([ClashRule, ClashType, ClashMode])],
  controllers: [Controller],
  providers: [Service],
})
export default class ClashModule {}
