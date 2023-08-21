import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import {
  ClashConfig as ClashConfigSchema,
  ClashRule as ClashRuleSchema,
  ClashType as ClashTypeSchema,
  ClashMode as ClashModeSchema,
  ClashProxy as ClashProxySchema,
} from '../admin/clash/model';
import { ReturnModelType } from '@typegoose/typegoose';

@Injectable()
export default class Service {
  constructor(
    @InjectModel(ClashConfigSchema)
    private readonly ClashConfigModel: ReturnModelType<
      typeof ClashConfigSchema
    >,
    @InjectModel(ClashRuleSchema)
    private readonly ClashRuleModel: ReturnModelType<typeof ClashRuleSchema>,
    @InjectModel(ClashModeSchema)
    private readonly ClashModeModel: ReturnModelType<typeof ClashModeSchema>,
    @InjectModel(ClashTypeSchema)
    private readonly ClashTypeModel: ReturnModelType<typeof ClashTypeSchema>,
    @InjectModel(ClashProxySchema)
    private readonly ClashProxyModel: ReturnModelType<typeof ClashProxySchema>,
  ) {}

  async findConfig(): Promise<ClashConfigSchema> {
    return this.ClashConfigModel.findOne();
  }

  async findRuleList(): Promise<ClashRuleSchema[]> {
    return this.ClashRuleModel.find();
  }

  async findTypeList(): Promise<ClashTypeSchema[]> {
    return this.ClashTypeModel.find();
  }

  async findModeList(): Promise<ClashModeSchema[]> {
    return this.ClashModeModel.find();
  }

  async findProxyList(): Promise<Record<string, any>[]> {
    const proxies = await this.ClashProxyModel.find();
    return proxies.filter(ele => !!ele?.content).map(ele => ele.content);
  }
}
