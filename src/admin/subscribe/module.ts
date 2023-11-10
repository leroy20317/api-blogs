import { Module } from '@nestjs/common';
import Controller from './controller';
import { TypegooseModule } from 'nestjs-typegoose';
import {
  SubscribeRule,
  SubscribeType,
  SubscribeMode,
  SubscribeProxy,
} from './model';
import Service from './service';

@Module({
  imports: [
    TypegooseModule.forFeature([
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
