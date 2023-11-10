import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import {
  SubscribeRule as SubscribeRuleSchema,
  SubscribeType as SubscribeTypeSchema,
  SubscribeMode as SubscribeModeSchema,
  SubscribeProxy as SubscribeProxySchema,
} from './model';
import { ReturnModelType } from '@typegoose/typegoose';
import { List as RuleList, Edit as RuleEdit } from './dto/rules';
import { List as ProxyList, Edit as ProxyEdit } from './dto/proxies';
import { getPage, Page } from '../../utils/util';

@Injectable()
export default class Service {
  constructor(
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

  async findTypeList(): Promise<SubscribeTypeSchema[]> {
    return this.SubscribeTypeModel.find();
  }

  async findModeList(): Promise<SubscribeModeSchema[]> {
    return this.SubscribeModeModel.find();
  }

  async findRuleList(
    query: RuleList,
  ): Promise<Page<SubscribeRuleSchema> | null> {
    const { page = 1, size = 10, mode, type, site, resolve } = query;
    const filter: any = {};
    if (mode) filter.mode = { $in: mode.split(',') };
    if (site) filter.site = { $regex: site, $options: 'i' };
    if (type) filter.type = { $in: type.split(',') };
    if (resolve) filter.resolve = { $in: resolve.split(',') };
    return getPage(this.SubscribeRuleModel, page, size, filter, { _id: -1 });
  }

  async findRuleById(id: string): Promise<SubscribeRuleSchema | null> {
    const data = await this.SubscribeRuleModel.findById(id);
    if (!data) {
      throw new HttpException(`id为 ${id} 的规则不存在`, 404);
    }
    return data;
  }

  async createRule(rule: RuleEdit): Promise<SubscribeRuleSchema> {
    const createdResult = new this.SubscribeRuleModel(rule);
    return createdResult.save();
  }

  async updateRule(id: string, rule: RuleEdit): Promise<SubscribeRuleSchema> {
    await this.findRuleById(id);
    return this.SubscribeRuleModel.findByIdAndUpdate(id, rule, { new: true });
  }

  async removeRule(id: string): Promise<SubscribeRuleSchema> {
    await this.findRuleById(id);
    return this.SubscribeRuleModel.findByIdAndDelete(id);
  }

  async findProxyList(
    query: ProxyList,
  ): Promise<Page<SubscribeProxySchema> | null> {
    const { page = 1, size = 10 } = query;
    return getPage(this.SubscribeProxyModel, page, size, {}, { _id: -1 });
  }

  async findProxyById(id: string): Promise<SubscribeProxySchema | null> {
    const data = await this.SubscribeProxyModel.findById(id);
    if (!data) {
      throw new HttpException(`id为 ${id} 的代理不存在`, 404);
    }
    return data;
  }

  async createProxy(rule: ProxyEdit): Promise<SubscribeProxySchema> {
    const createdResult = new this.SubscribeProxyModel(rule);
    return createdResult.save();
  }

  async updateProxy(
    id: string,
    rule: ProxyEdit,
  ): Promise<SubscribeProxySchema> {
    await this.findProxyById(id);
    return this.SubscribeProxyModel.findByIdAndUpdate(id, rule, { new: true });
  }

  async removeProxy(id: string): Promise<SubscribeProxySchema> {
    await this.findProxyById(id);
    return this.SubscribeProxyModel.findByIdAndDelete(id);
  }
}
