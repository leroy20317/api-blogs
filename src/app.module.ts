import {Module} from '@nestjs/common';
import {AdminModule} from './admin/admin.module';
import {WebModule} from './web/web.module';
import {TypegooseModule} from "nestjs-typegoose";
import "./utils/env";
import {APP_GUARD} from "@nestjs/core";
import {RoleAuthGuard} from "./auth/guard";

@Module({
  imports: [
    TypegooseModule.forRoot(process.env.MONGODB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    }),
    AdminModule,
    WebModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RoleAuthGuard
    }
  ]
})
export class AppModule {
}
