import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import HomeModule from './home/module';
import ArticleModule from './article/module';
import EnvelopeModule from './envelope/module';
import AboutModule from './about/module';
import InfoModule from './info/module';
import AuthModule from '../auth/auth.module';
import FilesModule from './files/module';
import InfoService from './info/service';
import { TypegooseModule } from 'nestjs-typegoose';
import Info from './info/model';

@Module({
  imports: [
    TypegooseModule.forFeature([Info]),
    AuthModule,
    HomeModule,
    ArticleModule,
    EnvelopeModule,
    AboutModule,
    InfoModule,
    FilesModule,
  ],
  controllers: [AdminController],
  providers: [InfoService],
})
export class AdminModule {}
