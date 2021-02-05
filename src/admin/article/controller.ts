import {Body, Controller, Delete, Get, Param, Post, Put, Query} from '@nestjs/common';
import {ApiBearerAuth, ApiOperation, ApiTags} from '@nestjs/swagger'
import ListDto from "./dto/list.dto";
import CreateDto from "./dto/create.dto";
import UpdateDto from "./dto/update.dto";
import Service from "./service";
import VerifyIdPipe from "../../pipe/verify-id.pipe";
import {Result} from "../../utils/util";

@ApiBearerAuth()
@Controller('admin/article')
@ApiTags('后台/文章')
export default class ArticleController {
  constructor(private readonly service: Service) {
  }

  @Get()
  @ApiOperation({summary: '列表'})
  async index(@Query() query: ListDto): Promise<Result> {
    const data = await this.service.findList(query);
    return {
      status: 'success',
      body: data
    }
  }

  @Get(':id')
  @ApiOperation({summary: '详情'})
  async detail(@Param('id', new VerifyIdPipe()) id: string): Promise<Result> {
    const data = await this.service.findById(id);
    return {
      status: 'success',
      body: data
    }
  }

  @Post()
  @ApiOperation({summary: '创建'})
  async create(@Body() article: CreateDto): Promise<Result> {
    const data = await this.service.create(article);
    return {
      status: 'success',
      message: '创建成功！',
      body: data
    }
  }

  @Put(':id')
  @ApiOperation({summary: '更新'})
  async update(@Body() article: UpdateDto, @Param('id', new VerifyIdPipe()) id: string): Promise<Result> {
    const data = await this.service.update(id, article);
    return {
      status: 'success',
      message: '更新成功！',
      body: data
    }
  }

  @Delete(':id')
  @ApiOperation({summary: '删除'})
  async remove(@Param('id', new VerifyIdPipe()) id: string): Promise<Result> {
    await this.service.remove(id);
    return {
      status: 'success',
      message: '删除成功！',
    }
  }

}
