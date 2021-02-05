import {Module} from '@nestjs/common';
import EnvelopeController from './controller';
import {TypegooseModule} from "nestjs-typegoose";
import Envelope from "./model";
import EnvelopeService from './service'

@Module({
  imports: [TypegooseModule.forFeature([Envelope])],
  controllers: [EnvelopeController],
  providers: [EnvelopeService]
})
export default class EnvelopeModule {
}
