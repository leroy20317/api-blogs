import {HttpException, Injectable} from "@nestjs/common";
import {InjectModel} from "nestjs-typegoose";
import ArticleSchema from "./model";
import ListDto from "./dto/list.dto";
import CreateDto from "./dto/create.dto";
import UpdateDto from "./dto/update.dto";
import {ReturnModelType} from "@typegoose/typegoose";
import {getPage, Page} from "../../utils/util";

@Injectable()
export default class ArticleService {
  constructor(
      @InjectModel(ArticleSchema)
      private readonly Model: ReturnModelType<typeof ArticleSchema>
  ) {
  }

  async findList(query: ListDto): Promise<Page<ArticleSchema> | null> {
    const {page = 1, size = 10} = query;
    return getPage(this.Model, page, size);
  }

  async findById(id: string): Promise<ArticleSchema | null> {
    const data = await this.Model.findById(id);
    if (!data) {
      throw new HttpException(`id为 ${id} 的文章不存在`, 404);
    }
    return data;
  }

  async create(article: CreateDto): Promise<ArticleSchema> {
    const createdResult = new this.Model(article);
    return await createdResult.save();
  }

  async update(id: string, article: UpdateDto): Promise<ArticleSchema> {
    const result = await this.Model.findById(id)
    if (!result) {
      throw new HttpException(`id为 ${id} 的文章不存在！`, 404);
    }
    return await this.Model.findByIdAndUpdate(id, article, {new: true});
  }

  async remove(id: string): Promise<ArticleSchema> {
    const result = await this.Model.findById(id)
    if (!result) {
      throw new HttpException(`id为 ${id} 的文章不存在！`, 404);
    }
    return await this.Model.findByIdAndDelete(id);
  }

}