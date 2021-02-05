import {HttpException, Injectable} from "@nestjs/common";
import {InjectModel} from "nestjs-typegoose";
import ArticleSchema from "../admin/article/model";
import {ArticleListDto, ListDto} from "./dto/list.dto";
import {ReturnModelType} from "@typegoose/typegoose";
import {formatNow, getPage, Page} from "../utils/util";
import EnvelopSchema from "../admin/envelope/model";
import AboutSchema from "../admin/about/model";
import CommentSchema from "../admin/comment/model";
import InfoSchema from "../admin/info/model";
import {CommentDto, ReplayDto} from "./dto/comment.dto";

@Injectable()
export default class WebService {
  constructor(
      @InjectModel(InfoSchema)
      private readonly InfoModel: ReturnModelType<typeof ArticleSchema>,
      @InjectModel(ArticleSchema)
      private readonly ArticleModel: ReturnModelType<typeof ArticleSchema>,
      @InjectModel(EnvelopSchema)
      private readonly EnvelopModel: ReturnModelType<typeof EnvelopSchema>,
      @InjectModel(CommentSchema)
      private readonly CommentModel: ReturnModelType<typeof CommentSchema>,
      @InjectModel(AboutSchema)
      private readonly AboutModel: ReturnModelType<typeof AboutSchema>,
  ) {
  }

  async findInfo(): Promise<InfoSchema | null> {
    return this.InfoModel.findOne();
  }

  async findAbout(): Promise<AboutSchema | null> {
    return this.AboutModel.findOne();
  }

  async findEnvelopeList(query: ListDto): Promise<Page<EnvelopSchema> | null> {
    const {page = 1, size = 10} = query;
    return getPage(this.EnvelopModel, page, size);
  }

  async findArticleList(query: ArticleListDto): Promise<Page<ArticleSchema> | null> {
    const {page = 1, size = 10, mood = 0} = query;
    const result = await getPage(this.ArticleModel, page, size);
    return {
      ...result,
      data: Number(mood) === 1 ? result.data.reduce((total, item) => {
        const [year, month] = item.time.split(/[-|\-|\/| | |:]/);
        total['_' + year] = total['_' + year] || {};
        total['_' + year][month] = total['_' + year][month] || [];
        total['_' + year][month].push(item);
        return total
      }, {}) : result.data,
    }
  }

  async findArticleByIdAndRead(id: string): Promise<ArticleSchema | null> {
    const data = await this.ArticleModel.findById(id);
    if (!data) {
      throw new HttpException(`id为 ${id} 的文章不存在`, 404);
    }
    const detail = await this.ArticleModel.findByIdAndUpdate(id, {
      $inc: {'read': 1}
    }, {
      new: true
    });

    return detail;
  }

  async findByIdAndLike(id: string): Promise<ArticleSchema | null> {
    const data = await this.ArticleModel.findById(id);
    if (!data) {
      throw new HttpException(`id为 ${id} 的文章不存在`, 404);
    }
    const detail = await this.ArticleModel.findByIdAndUpdate(id, {
      $inc: {'like': 1}
    }, {
      new: true
    });

    return detail;
  }

  async findCommentByArticleId(id: string): Promise<{ data: any[], total: number } | null> {
    const data = await this.ArticleModel.findById(id);
    if (!data) {
      throw new HttpException(`id为 ${id} 的文章不存在`, 404);
    }

    const comment = await this.CommentModel.find({article_id: id});

    // 一级评论和子级评论格式转化
    const result = comment.reduce((total, item) => {
      if (item.type === 1) {
        item._doc['child'] = []
        total.push(item)
      } else {
        total.forEach(i => {
          if (i.id === item.parent_id) {
            i._doc['child'].push(item)
          }
        })
      }
      return total
    }, []).reverse()

    const total = comment.length;

    return {data: result, total};
  }

  async comment(id: string, comment: CommentDto): Promise<CommentSchema> {
    const article = await this.ArticleModel.findById(id);
    if (!article) {
      throw new HttpException(`评论的文章不存在`, 404);
    }
    const info = await this.InfoModel.findOne();

    const {name, content, email, image} = comment;
    const data = {
      article_id: id,
      name,
      content,
      email,
      image,
      time: formatNow(),
      reply_name: info.comment.name,
      reply_email: info.comment.email,
      type: 1,
      parent_id: '',
      admin: info.comment.email === email,
    };

    const createdResult = new this.CommentModel(data);
    return await createdResult.save();
  }

  async replay(id: string, replay: ReplayDto): Promise<CommentSchema> {
    const comment = await this.CommentModel.findById(id);
    if (!comment) {
      throw new HttpException(`回复的评论不存在`, 404);
    }

    const {name, content, email, image, reply_name, reply_email} = replay;
    const article = await this.ArticleModel.findById(comment.article_id);
    if (!article) {
      throw new HttpException(`评论的文章不存在`, 404);
    }
    const info = await this.InfoModel.findOne();

    const data = {
      article_id: comment.article_id,
      parent_id: comment.parent_id || id,
      name,
      content,
      email,
      image,
      time: formatNow(),
      reply_name,
      reply_email,
      type: comment.parent_id ? 3 : 2,
      admin: info.comment.email === email,
    };

    const createdResult = new this.CommentModel(data);
    return await createdResult.save();
  }

}