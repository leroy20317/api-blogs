import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import {
  ClashConfig as ClashConfigSchema,
  SubscribeRule as SubscribeRuleSchema,
  SubscribeType as SubscribeTypeSchema,
  SubscribeMode as SubscribeModeSchema,
  SubscribeProxy as SubscribeProxySchema,
} from '../admin/Subscribe/model';
import { ReturnModelType } from '@typegoose/typegoose';
import { Mode } from './enum';

@Injectable()
export default class Service {
  constructor(
    @InjectModel(ClashConfigSchema)
    private readonly ClashConfigModel: ReturnModelType<
      typeof ClashConfigSchema
    >,
    @InjectModel(SubscribeRuleSchema)
    private readonly SubscribeRuleModel: ReturnModelType<
      typeof SubscribeRuleSchema
    >,
    @InjectModel(SubscribeModeSchema)
    private readonly SubscribeModeModel: ReturnModelType<
      typeof SubscribeModeSchema
    >,
    @InjectModel(SubscribeTypeSchema)
    private readonly SubscribeTypeModel: ReturnModelType<
      typeof SubscribeTypeSchema
    >,
    @InjectModel(SubscribeProxySchema)
    private readonly SubscribeProxyModel: ReturnModelType<
      typeof SubscribeProxySchema
    >,
  ) {}

  async findClashConfig(): Promise<ClashConfigSchema> {
    return this.ClashConfigModel.findOne();
  }

  async findRuleList(): Promise<SubscribeRuleSchema[]> {
    return this.SubscribeRuleModel.find();
  }

  async findTypeList(): Promise<SubscribeTypeSchema[]> {
    return this.SubscribeTypeModel.find();
  }

  async findModeList(): Promise<SubscribeModeSchema[]> {
    return this.SubscribeModeModel.find();
  }

  async findProxyList(): Promise<Record<string, any>[]> {
    const proxies = await this.SubscribeProxyModel.find();
    return proxies.filter(ele => !!ele?.content).map(ele => ele.content);
  }
}
