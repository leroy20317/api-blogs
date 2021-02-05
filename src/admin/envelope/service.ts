import {HttpException, Injectable} from "@nestjs/common";
import {InjectModel} from "nestjs-typegoose";
import EnvelopSchema from "./model";
import ListDto from "./dto/list.dto";
import CreateDto from "./dto/create.dto";
import UpdateDto from "./dto/update.dto";
import {ReturnModelType} from "@typegoose/typegoose";
import {getPage, Page} from "../../utils/util";

@Injectable()
export default class EnvelopService {
  constructor(
      @InjectModel(EnvelopSchema) private readonly Model: ReturnModelType<typeof EnvelopSchema>
  ) {
  }

  async findList(query: ListDto): Promise<Page<EnvelopSchema> | null> {
    const {page = 1, size = 10} = query;
    return await getPage(this.Model, page, size);
  }

  async findById(id: string): Promise<EnvelopSchema | null> {
    const data = await this.Model.findById(id);
    if (!data) {
      throw new HttpException(`id为 ${id} 的短语不存在`, 404);
    }
    return data;
  }

  async create(envelop: CreateDto): Promise<EnvelopSchema> {
    const createdResult = new this.Model(envelop);
    return await createdResult.save();
  }

  async update(id: string, envelop: UpdateDto): Promise<EnvelopSchema> {
    const result = await this.Model.findById(id)
    if (!result) {
      throw new HttpException(`id为 ${id} 的短语不存在！`, 404);
    }
    return await this.Model.findByIdAndUpdate(id, envelop, {new: true});
  }

  async remove(id: string): Promise<EnvelopSchema> {
    const result = await this.Model.findById(id)
    if (!result) {
      throw new HttpException(`id为 ${id} 的短语不存在！`, 404);
    }
    return await this.Model.findByIdAndDelete(id);
  }

}