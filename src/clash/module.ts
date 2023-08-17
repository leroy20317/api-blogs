import {Module} from '@nestjs/common';
import Controller from './controller';
import {TypegooseModule} from "nestjs-typegoose";
import {ClashConfig, ClashRule, ClashType, ClashMode} from "../admin/clash/model";
import Service from './service'

@Module({
  imports: [TypegooseModule.forFeature([ClashConfig, ClashRule, ClashType, ClashMode])],
  controllers: [Controller],
  providers: [Service]
})
export default class ClashModule {
}
