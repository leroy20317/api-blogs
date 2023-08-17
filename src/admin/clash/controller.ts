import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import Service from './service';
import Create from './dto/create';
import { Result } from '../../utils/util';
import Update from './dto/update';
import VerifyIdPipe from '../../pipe/verify-id.pipe';
import List from './dto/list';

@ApiBearerAuth()
@Controller('admin/clash')
@ApiTags('后台/clash订阅')
export default class ClashController {
  constructor(private readonly service: Service) {}

  @Get('types')
  @ApiOperation({ summary: '订阅类型列表' })
  async types(): Promise<Result> {
    const data = await this.service.findTypeList();
    return {
      status: 'success',
      body: data,
    };
  }

  @Get('modes')
  @ApiOperation({ summary: '订阅模式列表' })
  async modes(): Promise<Result> {
    const data = await this.service.findModeList();
    return {
      status: 'success',
      body: data,
    };
  }

  @Get('rules')
  @ApiOperation({ summary: '订阅规则列表' })
  async rules(@Query() query: List): Promise<Result> {
    const data = await this.service.findRuleList(query);
    return {
      status: 'success',
      body: data,
    };
  }

  @Post('rules')
  @ApiOperation({ summary: '创建规则' })
  async create(@Body() rule: Create): Promise<Result> {
    const data = await this.service.createRule(rule);
    return {
      status: 'success',
      message: '创建成功！',
      body: data,
    };
  }

  @Put('rules/:id')
  @ApiOperation({ summary: '更新' })
  async update(
    @Body() rule: Update,
    @Param('id', new VerifyIdPipe()) id: string,
  ): Promise<Result> {
    const data = await this.service.updateRule(id, rule);
    return {
      status: 'success',
      message: '更新成功！',
      body: data,
    };
  }

  @Delete('rules/:id')
  @ApiOperation({ summary: '删除' })
  async remove(@Param('id', new VerifyIdPipe()) id: string): Promise<Result> {
    await this.service.removeRule(id);
    return {
      status: 'success',
      message: '删除成功！',
    };
  }
}
