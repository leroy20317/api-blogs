import {BadRequestException, Injectable} from '@nestjs/common';
import {InjectModel} from "nestjs-typegoose";
import UserSchema from "./user.model";
import {ReturnModelType} from "@typegoose/typegoose";
import {UserDto} from "./user.dto";

@Injectable()
export default class UserService {
  constructor(
      @InjectModel(UserSchema)
      private readonly Model: ReturnModelType<typeof UserSchema>,
  ) {
  }

  async findOne({username, password}: UserDto): Promise<UserSchema | null> {
    return this.Model.findOne({username, password});
  }

  async create(user: UserDto): Promise<UserSchema | null> {
    const userInfo = await this.Model.findOne();
    if (userInfo) {
      throw new BadRequestException(`不能重复注册！`);
    }
    const createdResult = new this.Model(user);
    return await createdResult.save();
  }

}
