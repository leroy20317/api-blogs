import {Module} from '@nestjs/common';
import ArticleController from './controller';
import {TypegooseModule} from "nestjs-typegoose";
import Article from "./model";
import ArticleService from './service'

@Module({
  imports: [TypegooseModule.forFeature([Article])],
  controllers: [ArticleController],
  providers: [ArticleService]
})
export default class ArticleModule {
}
