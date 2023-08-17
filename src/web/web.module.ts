import {Module} from '@nestjs/common';
import {TypegooseModule} from "nestjs-typegoose";
import Article from "../admin/article/model";
import Envelop from "../admin/envelope/model";
import Info from "../admin/info/model";
import About from "../admin/about/model";
import WebController from "./web.controller";
import WebService from "./web.service";

@Module({
  imports: [
    TypegooseModule.forFeature([Article, Envelop, Info, About])
  ],
  controllers: [WebController],
  providers: [WebService]
})
export class WebModule {
}
