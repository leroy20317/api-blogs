import {Module} from '@nestjs/common';
import CommentController from './controller';
import {TypegooseModule} from "nestjs-typegoose";
import Comment from "./model";
import Info from "../info/model";
import Article from "../article/model";
import CommentService from './service'

@Module({
  imports: [TypegooseModule.forFeature([Comment, Info, Article])],
  controllers: [CommentController],
  providers: [CommentService]
})
export default class CommentModule {
}
