import {Module} from '@nestjs/common';
import HomeController from './controller';
import {TypegooseModule} from "nestjs-typegoose";
import Info from "../info/model";
import Article from "../article/model";
import Envelope from "../envelope/model";
import HomeService from './service'

@Module({
  imports: [TypegooseModule.forFeature([Info, Article, Envelope])],
  controllers: [HomeController],
  providers: [HomeService]
})
export default class HomeModule {
}
