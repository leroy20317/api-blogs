import {Body, Controller, Delete, Get, Param, Post, Put, Query} from '@nestjs/common';
import {ApiBearerAuth, ApiOperation, ApiTags} from '@nestjs/swagger'
import List from "./dto/list";
import Create from "./dto/create";
import Update from "./dto/update";
import Service from "./service";
import VerifyIdPipe from "../../pipe/verify-id.pipe";

@ApiBearerAuth()
@Controller('admin/envelope')
@ApiTags('后台/短语')
export default class EnvelopController {
  constructor(private readonly service: Service) {
  }

  @Get()
  @ApiOperation({summary: '列表'})
  async index(@Query() query: List) {
    const data = await this.service.findList(query);
    return {
      status: 'success',
      body: data
    }
  }

  @Get(':id')
  @ApiOperation({summary: '详情'})
  async detail(@Param('id', new VerifyIdPipe()) id: string) {
    const data = await this.service.findById(id);
    return {
      status: 'success',
      body: data
    }
  }

  @Post()
  @ApiOperation({summary: '创建'})
  async create(@Body() envelop: Create) {
    const data = await this.service.create(envelop);
    return {
      status: 'success',
      message: '创建成功！',
      body: data
    }
  }

  @Put(':id')
  @ApiOperation({summary: '更新'})
  async update(@Body() envelop: Update, @Param('id', new VerifyIdPipe()) id: string) {
    const data = await this.service.update(id, envelop);
    return {
      status: 'success',
      message: '更新成功！',
      body: data
    }
  }

  @Delete(':id')
  @ApiOperation({summary: '删除'})
  async remove(@Param('id', new VerifyIdPipe()) id: string) {
    await this.service.remove(id);
    return {
      status: 'success',
      message: '删除成功！',
    }
  }

}
