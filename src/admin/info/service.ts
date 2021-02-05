import {Injectable} from "@nestjs/common";
import {InjectModel} from "nestjs-typegoose";
import InfoSchema from "./model";
import InfoDto from "./dto";
import {ReturnModelType} from "@typegoose/typegoose";

@Injectable()
export default class InfoService {
  constructor(
      @InjectModel(InfoSchema) private readonly Model: ReturnModelType<typeof InfoSchema>
  ) {
  }

  async find(): Promise<InfoSchema | null> {

    return this.Model.findOne();
  }

  async update(about: InfoDto): Promise<InfoSchema> {
    const {_id: id} = await this.Model.findOne() || {};
    if (!id) {
      const createdResult = new this.Model(about);
      return await createdResult.save();
    } else {
      return this.Model.findByIdAndUpdate(id, about, {new: true});
    }
  }
}