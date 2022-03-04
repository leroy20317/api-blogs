import {Injectable} from "@nestjs/common";
import {InjectModel} from "nestjs-typegoose";
import InfoSchema from "../info/model";
import ArticleSchema from "../article/model";
import EnvelopeSchema from "../envelope/model";
import {ReturnModelType} from "@typegoose/typegoose";
import axios from 'axios'

type Comments = {
  id: number,
  user: {
    name: string,
    avatar_url: string
  },
  created_at: string,
  content: string
}[]

@Injectable()
export default class HomeService {
  constructor(
      @InjectModel(InfoSchema) private readonly InfoModel: ReturnModelType<typeof InfoSchema>,
      @InjectModel(ArticleSchema) private readonly ArticleModel: ReturnModelType<typeof ArticleSchema>,
      @InjectModel(EnvelopeSchema) private readonly EnvelopeModel: ReturnModelType<typeof EnvelopeSchema>,
  ) {
  }

  async fetchComment() {
    const issues = await axios.get<{ comments_url: string }[]>('http://api.github.com/repos/leroy20317/blog-comments/issues').then(response => response.data);
    const comments_urls = issues.map(item => item.comments_url);

    const comments = await Promise.all(comments_urls.map(url => {
      return axios.get<{
        id: number,
        user: {
          login: string,
          avatar_url: string,
        },
        created_at: string,
        body: string
      }[]>(url).then(response => response.data);
    }))

    return comments.reduce<Comments>((previousValue, currentValue) => {
      return previousValue.concat(currentValue.map(current => ({
        id: current.id,
        user: {
          name: current.user.login,
          avatar_url: current.user.avatar_url,
        },
        created_at: current.created_at,
        content: current.body
      })))
    }, [])

  }

  async find(): Promise<[ArticleSchema, number, EnvelopeSchema[], Comments] | null> {
    /**
     * 最后一篇文章
     * 文章总数
     * 短语列表
     * 评论
     */
    return Promise.all([
      this.ArticleModel.findOne().sort({time: -1}),
      this.ArticleModel.countDocuments(),
      this.EnvelopeModel.find().sort({time: -1}).limit(8),
      this.fetchComment()
    ])
  }

}
