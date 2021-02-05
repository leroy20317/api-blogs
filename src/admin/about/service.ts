import {Injectable} from '@nestjs/common';
import {InjectModel} from 'nestjs-typegoose';
import AboutSchema from './model';
import AboutDto from './dto';
import {ReturnModelType} from '@typegoose/typegoose';

@Injectable()
export default class AboutService {
  constructor(
      @InjectModel(AboutSchema)
      private readonly Model: ReturnModelType<typeof AboutSchema>,
  ) {
  }

  async find(): Promise<AboutSchema | null> {

    return this.Model.findOne();
  }

  async update(about: AboutDto): Promise<AboutSchema> {
    const {_id: id} = (await this.Model.findOne()) || {};
    if (!id) {
      const createdResult = new this.Model(about);
      return await createdResult.save();
    } else {
      return this.Model.findByIdAndUpdate(id, about, {new: true});
    }
  }
}
