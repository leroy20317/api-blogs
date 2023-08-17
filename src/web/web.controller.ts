import {Body, Controller, Get, Param, Post, Put, Query} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger'
import {ArticleListDto, ListDto} from "./dto/list.dto";
import Service from "./web.service";
import VerifyIdPipe from "../pipe/verify-id.pipe";
import {NoAuth} from "../auth/customize.decorator";
import {Result} from "../utils/util";

@Controller('web')
export default class WebController {
  constructor(private readonly service: Service) {
  }

  @NoAuth('never')
  @Get('info')
  @ApiTags('前台/站台信息')
  async info(): Promise<Result> {
    const data = await this.service.findInfo();
    return {
      status: 'success',
      body: data
    }
  }

  @NoAuth('never')
  @Get('article')
  @ApiTags('前台/文章')
  @ApiOperation({summary: '列表'})
  async articleList(@Query() query: ArticleListDto): Promise<Result> {
    const data = await this.service.findArticleList(query);
    return {
      status: 'success',
      body: data
    }
  }

  @NoAuth('never')
  @Get('article/:id')
  @ApiTags('前台/文章')
  @ApiOperation({summary: '详情'})
  async articleDetail(@Param('id', new VerifyIdPipe()) id: string): Promise<Result> {
    const data = await this.service.findArticleByIdAndRead(id);
    return {
      status: 'success',
      body: data
    }
  }

  @NoAuth('never')
  @Put('article/like/:id')
  @ApiTags('前台/文章')
  @ApiOperation({summary: '点赞'})
  async articleLike(@Param('id', new VerifyIdPipe()) id: string): Promise<Result> {
    const data = await this.service.findByIdAndLike(id);
    return {
      status: 'success',
      message: '点赞成功！',
      body: data
    }
  }

  @NoAuth('never')
  @Get('envelope')
  @ApiTags('前台/短语')
  @ApiOperation({summary: '列表'})
  async envelope(@Query() query: ListDto): Promise<Result> {
    const data = await this.service.findEnvelopeList(query);
    return {
      status: 'success',
      body: data
    }
  }

  @NoAuth('never')
  @Get('about')
  @ApiTags('前台/个人介绍')
  async about(): Promise<Result> {
    const data = await this.service.findAbout();
    return {
      status: 'success',
      body: data
    }
  }

}
