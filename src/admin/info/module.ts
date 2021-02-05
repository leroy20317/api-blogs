import {Module} from '@nestjs/common';
import InfoController from './controller';
import {TypegooseModule} from "nestjs-typegoose";
import Info from "./model";
import InfoService from './service'

@Module({
  imports: [TypegooseModule.forFeature([Info])],
  controllers: [InfoController],
  providers: [InfoService]
})
export default class InfoModule {
}
