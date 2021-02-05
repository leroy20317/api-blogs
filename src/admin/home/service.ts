import {Injectable} from "@nestjs/common";
import {InjectModel} from "nestjs-typegoose";
import InfoSchema from "../info/model";
import ArticleSchema from "../article/model";
import EnvelopeSchema from "../envelope/model";
import {ReturnModelType} from "@typegoose/typegoose";
import CommentSchema from "../comment/model";

@Injectable()
export default class HomeService {
  constructor(
      @InjectModel(InfoSchema) private readonly InfoModel: ReturnModelType<typeof InfoSchema>,
      @InjectModel(ArticleSchema) private readonly ArticleModel: ReturnModelType<typeof ArticleSchema>,
      @InjectModel(EnvelopeSchema) private readonly EnvelopeModel: ReturnModelType<typeof EnvelopeSchema>,
      @InjectModel(CommentSchema) private readonly CommentModel: ReturnModelType<typeof CommentSchema>,
  ) {
  }

  async find(): Promise<[ArticleSchema, number, EnvelopeSchema[], number, number] | null> {
    /**
     * 最后一篇文章
     * 文章总数
     * 短语列表
     * 评论总数量
     * 评论未读数量
     */
    return Promise.all([
      this.ArticleModel.findOne().sort({time: -1}),
      this.ArticleModel.countDocuments(),
      this.EnvelopeModel.find().sort({time: -1}).limit(8),
      this.CommentModel.countDocuments(),
      this.CommentModel.find({status: 1}).countDocuments(),
    ])

  }

}