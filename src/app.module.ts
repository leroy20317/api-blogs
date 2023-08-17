import {Module} from '@nestjs/common';
import {AdminModule} from './admin/admin.module';
import {WebModule} from './web/web.module';
import {TypegooseModule} from "nestjs-typegoose";
import "./utils/env";
import {APP_GUARD} from "@nestjs/core";
import {RoleAuthGuard} from "./auth/guard";
import {ScheduleModule} from '@nestjs/schedule'; // 定时任务
import BackupModule from "./backup/module";
import ClashModule from "./clash/module"
const {MONGO_PORT, MONGO_HOST, MONGO_DB, MONGO_USER, MONGO_PASSWORD} = process.env

@Module({
  imports: [
    TypegooseModule.forRoot(`mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    }),
    AdminModule,
    WebModule,
    BackupModule,
    ClashModule,
    ScheduleModule.forRoot()
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RoleAuthGuard
    },
  ]
})
export class AppModule {
}
