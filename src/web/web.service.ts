import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import ArticleSchema from '../admin/article/model';
import { ArticleListDto, ListDto } from './dto/list.dto';
import { ReturnModelType } from '@typegoose/typegoose';
import { formatNow, getPage, Page } from '../utils/util';
import EnvelopSchema from '../admin/envelope/model';
import AboutSchema from '../admin/about/model';
import InfoSchema from '../admin/info/model';
import { CommentDto, ReplayDto } from './dto/comment.dto';

@Injectable()
export default class WebService {
  constructor(
    @InjectModel(InfoSchema)
    private readonly InfoModel: ReturnModelType<typeof InfoSchema>,
    @InjectModel(ArticleSchema)
    private readonly ArticleModel: ReturnModelType<typeof ArticleSchema>,
    @InjectModel(EnvelopSchema)
    private readonly EnvelopModel: ReturnModelType<typeof EnvelopSchema>,
    @InjectModel(AboutSchema)
    private readonly AboutModel: ReturnModelType<typeof AboutSchema>,
  ) {}

  async findInfo(): Promise<InfoSchema | null> {
    return this.InfoModel.findOne();
  }

  async findAbout(): Promise<AboutSchema | null> {
    return this.AboutModel.findOne();
  }

  async findEnvelopeList(query: ListDto): Promise<Page<EnvelopSchema> | null> {
    const { page = 1, size = 10 } = query;
    return getPage(this.EnvelopModel, page, size);
  }

  async findArticleList(
    query: ArticleListDto,
  ): Promise<Page<ArticleSchema> | null> {
    const { page = 1, size = 10, mood = 0 } = query;
    const result = await getPage(this.ArticleModel, page, size);
    return {
      ...result,
      data:
        Number(mood) === 1
          ? result.data.reduce((total, item) => {
              const [year, month] = item.time.split(/[-|\-|\/| | |:]/);
              total['_' + year] = total['_' + year] || {};
              total['_' + year][month] = total['_' + year][month] || [];
              total['_' + year][month].push(item);
              return total;
            }, {})
          : result.data,
    };
  }

  async findArticleByIdAndRead(id: string): Promise<ArticleSchema | null> {
    const data = await this.ArticleModel.findById(id);
    if (!data) {
      throw new HttpException(`id为 ${id} 的文章不存在`, 404);
    }
    const detail = await this.ArticleModel.findByIdAndUpdate(
      id,
      {
        $inc: { read: 1 },
      },
      {
        new: true,
      },
    );

    return detail;
  }

  async findByIdAndLike(id: string): Promise<ArticleSchema | null> {
    const data = await this.ArticleModel.findById(id);
    if (!data) {
      throw new HttpException(`id为 ${id} 的文章不存在`, 404);
    }
    const detail = await this.ArticleModel.findByIdAndUpdate(
      id,
      {
        $inc: { like: 1 },
      },
      {
        new: true,
      },
    );

    return detail;
  }
}
