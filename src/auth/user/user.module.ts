import {Module} from '@nestjs/common';
import UserService from './user.service';
import {TypegooseModule} from "nestjs-typegoose";
import User from "./user.model";

@Module({
  imports: [
    TypegooseModule.forFeature([User]),
  ],
  providers: [UserService],
  exports: [UserService]
})
export default class UserModule {
}
