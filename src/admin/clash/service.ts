import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import {
  ClashRule as ClashRuleSchema,
  ClashType as ClashTypeSchema,
  ClashMode as ClashModeSchema,
  ClashProxy as ClashProxySchema,
} from './model';
import { ReturnModelType } from '@typegoose/typegoose';
import { List as RuleList, Edit as RuleEdit } from './dto/rules';
import { List as ProxyList, Edit as ProxyEdit } from './dto/proxies';
import { getPage, Page } from '../../utils/util';

@Injectable()
export default class Service {
  constructor(
    @InjectModel(ClashRuleSchema)
    private readonly ClashRuleModel: ReturnModelType<typeof ClashRuleSchema>,
    @InjectModel(ClashModeSchema)
    private readonly ClashModeModel: ReturnModelType<typeof ClashModeSchema>,
    @InjectModel(ClashTypeSchema)
    private readonly ClashTypeModel: ReturnModelType<typeof ClashTypeSchema>,

    @InjectModel(ClashProxySchema)
    private readonly ClashProxyModel: ReturnModelType<typeof ClashProxySchema>,
  ) {}

  async findTypeList(): Promise<ClashTypeSchema[]> {
    return this.ClashTypeModel.find();
  }

  async findModeList(): Promise<ClashModeSchema[]> {
    return this.ClashModeModel.find();
  }

  async findRuleList(query: RuleList): Promise<Page<ClashRuleSchema> | null> {
    const { page = 1, size = 10, mode, type, site, resolve } = query;
    const filter: any = {};
    if (mode) filter.mode = { $in: mode.split(',') };
    if (site) filter.site = { $regex: site, $options: 'i' };
    if (type) filter.type = { $in: type.split(',') };
    if (resolve) filter.resolve = { $in: resolve.split(',') };
    return getPage(this.ClashRuleModel, page, size, filter, { _id: -1 });
  }

  async findRuleById(id: string): Promise<ClashRuleSchema | null> {
    const data = await this.ClashRuleModel.findById(id);
    if (!data) {
      throw new HttpException(`id为 ${id} 的规则不存在`, 404);
    }
    return data;
  }

  async createRule(rule: RuleEdit): Promise<ClashRuleSchema> {
    const createdResult = new this.ClashRuleModel(rule);
    return createdResult.save();
  }

  async updateRule(id: string, rule: RuleEdit): Promise<ClashRuleSchema> {
    await this.findRuleById(id);
    return this.ClashRuleModel.findByIdAndUpdate(id, rule, { new: true });
  }

  async removeRule(id: string): Promise<ClashRuleSchema> {
    await this.findRuleById(id);
    return this.ClashRuleModel.findByIdAndDelete(id);
  }

  async findProxyList(
    query: ProxyList,
  ): Promise<Page<ClashProxySchema> | null> {
    const { page = 1, size = 10 } = query;
    return getPage(this.ClashProxyModel, page, size, {}, { _id: -1 });
  }

  async findProxyById(id: string): Promise<ClashProxySchema | null> {
    const data = await this.ClashProxyModel.findById(id);
    if (!data) {
      throw new HttpException(`id为 ${id} 的代理不存在`, 404);
    }
    return data;
  }

  async createProxy(rule: ProxyEdit): Promise<ClashProxySchema> {
    const createdResult = new this.ClashProxyModel(rule);
    return createdResult.save();
  }

  async updateProxy(id: string, rule: ProxyEdit): Promise<ClashProxySchema> {
    await this.findProxyById(id);
    return this.ClashProxyModel.findByIdAndUpdate(id, rule, { new: true });
  }

  async removeProxy(id: string): Promise<ClashProxySchema> {
    await this.findProxyById(id);
    return this.ClashProxyModel.findByIdAndDelete(id);
  }
}
