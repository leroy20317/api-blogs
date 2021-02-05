import {Module} from '@nestjs/common';
import AboutController from './controller';
import {TypegooseModule} from "nestjs-typegoose";
import About from "./model";
import AboutService from './service'

@Module({
  imports: [TypegooseModule.forFeature([About])],
  controllers: [AboutController],
  providers: [AboutService]
})
export default class AboutModule {
}
