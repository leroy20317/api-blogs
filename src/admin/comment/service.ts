import {HttpException, Injectable} from '@nestjs/common';
import {InjectModel} from 'nestjs-typegoose';
import CommentSchema from './model';
import ListDto from './dto/list.dto';
import {ReplayDto} from './dto/comment.dto';
import {ReturnModelType} from '@typegoose/typegoose';
import {formatNow, getPage, Page} from '../../utils/util';
import InfoSchema from '../info/model';
import ArticleSchema from '../article/model';

@Injectable()
export default class CommentService {
  constructor(
      @InjectModel(CommentSchema)
      private readonly Model: ReturnModelType<typeof CommentSchema>,
      @InjectModel(ArticleSchema)
      private readonly ArticleModel: ReturnModelType<typeof ArticleSchema>,
      @InjectModel(InfoSchema)
      private readonly InfoModel: ReturnModelType<typeof InfoSchema>,
  ) {
  }

  async findList(
      query: ListDto,
  ): Promise<Page<CommentSchema> | null> {
    const {page = 1, size = 10} = query;
    return await getPage(this.Model, page, size);
  }

  async replay(id: string, replay: ReplayDto): Promise<CommentSchema> {

    // 回复即已读
    const comment = await this.Model.findByIdAndUpdate(id, {$set: {status: 2}}, {new: true});
    if (!comment) {
      throw new HttpException(`回复的评论不存在`, 404);
    }

    const {content, reply_name, reply_email} = replay;

    const article = await this.ArticleModel.findById(comment.article_id);
    if (!article) {
      throw new HttpException(`评论的文章不存在`, 404);
    }

    const info = await this.InfoModel.findOne();

    const data = {
      article_id: comment.article_id,
      parent_id: comment.parent_id || id,
      name: info.comment.name,
      email: info.comment.email,
      content,
      image: 1,
      time: formatNow(),
      reply_name,
      reply_email,
      type: comment.parent_id ? 3 : 2,
      status: 2,
      admin: true,
    };

    const createdResult = new this.Model(data);
    return await createdResult.save();
  }

  async remove(id: string): Promise<any[]> {
    const result = await this.Model.findById(id);
    if (!result) {
      throw new HttpException(`id为 ${id} 的评论不存在！`, 404);
    }

    return Promise.all([
      this.Model.findByIdAndDelete(id),
      this.Model.deleteMany({parent_id: id}), // 为一级评论则删除所有子评论
    ]);
  }

  async read(
      ids: string[],
  ): Promise<{ ok: number; nModified: number; n: number }> {
    return this.Model.updateMany(
        {
          _id: {$in: ids},
          status: 1,
        },
        {
          $set: {status: 2},
        },
    );
  }
}
