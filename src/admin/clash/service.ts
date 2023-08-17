import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import {
  ClashRule as ClashRuleSchema,
  ClashType as ClashTypeSchema,
  ClashMode as ClashModeSchema,
} from './model';
import { ReturnModelType } from '@typegoose/typegoose';
import List from './dto/list';
import { getPage, Page } from '../../utils/util';
import Create from './dto/create';
import Update from './dto/update';

@Injectable()
export default class Service {
  constructor(
    @InjectModel(ClashRuleSchema)
    private readonly ClashRuleModel: ReturnModelType<typeof ClashRuleSchema>,
    @InjectModel(ClashModeSchema)
    private readonly ClashModeModel: ReturnModelType<typeof ClashModeSchema>,
    @InjectModel(ClashTypeSchema)
    private readonly ClashTypeModel: ReturnModelType<typeof ClashTypeSchema>,
  ) {}

  async findTypeList(): Promise<ClashTypeSchema[]> {
    return this.ClashTypeModel.find();
  }

  async findModeList(): Promise<ClashModeSchema[]> {
    return this.ClashModeModel.find();
  }

  async findRuleList(query: List): Promise<Page<ClashRuleSchema> | null> {
    const { page = 1, size = 10 } = query;
    return getPage(this.ClashRuleModel, page, size);
  }

  async findRuleById(id: string): Promise<ClashRuleSchema | null> {
    const data = await this.ClashRuleModel.findById(id);
    if (!data) {
      throw new HttpException(`id为 ${id} 的规则不存在`, 404);
    }
    return data;
  }

  async createRule(rule: Create): Promise<ClashRuleSchema> {
    const createdResult = new this.ClashRuleModel(rule);
    return createdResult.save();
  }

  async updateRule(id: string, rule: Update): Promise<ClashRuleSchema> {
    await this.findRuleById(id);
    return this.ClashRuleModel.findByIdAndUpdate(id, rule, { new: true });
  }

  async removeRule(id: string): Promise<ClashRuleSchema> {
    await this.findRuleById(id);
    return this.ClashRuleModel.findByIdAndDelete(id);
  }
}
