import { Module } from '@nestjs/common';
import Controller from './controller';
import { TypegooseModule } from 'nestjs-typegoose';
import {
  ClashConfig,
  SubscribeRule,
  SubscribeType,
  SubscribeMode,
  SubscribeProxy,
} from '../admin/subscribe/model';
import Service from './service';

@Module({
  imports: [
    TypegooseModule.forFeature([
      ClashConfig,
      SubscribeRule,
      SubscribeType,
      SubscribeMode,
      SubscribeProxy,
    ]),
  ],
  controllers: [Controller],
  providers: [Service],
})
export default class SubscribeModule {}
