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
import { List as RuleList, Edit as RuleEdit } from './dto/rules';
import { List as ProxyList, Edit as ProxyEdit } from './dto/proxies';
import { Result } from '../../utils/util';
import VerifyIdPipe from '../../pipe/verify-id.pipe';

@ApiBearerAuth()
@Controller('admin/subscribe')
@ApiTags('后台/订阅')
export default class SubscribeController {
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
  async rules(@Query() query: RuleList): Promise<Result> {
    const data = await this.service.findRuleList(query);
    return {
      status: 'success',
      body: data,
    };
  }

  @Post('rules')
  @ApiOperation({ summary: '创建规则' })
  async createRule(@Body() rule: RuleEdit): Promise<Result> {
    const data = await this.service.createRule(rule);
    return {
      status: 'success',
      message: '创建成功！',
      body: data,
    };
  }

  @Put('rules/:id')
  @ApiOperation({ summary: '更新规则' })
  async updateRule(
    @Body() rule: RuleEdit,
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
  @ApiOperation({ summary: '删除规则' })
  async removeRule(
    @Param('id', new VerifyIdPipe()) id: string,
  ): Promise<Result> {
    await this.service.removeRule(id);
    return {
      status: 'success',
      message: '删除成功！',
    };
  }

  @Get('proxies')
  @ApiOperation({ summary: '代理列表' })
  async proxies(@Query() query: ProxyList): Promise<Result> {
    const data = await this.service.findProxyList(query);
    return {
      status: 'success',
      body: data,
    };
  }

  @Post('proxies')
  @ApiOperation({ summary: '创建代理' })
  async createProxy(@Body() proxy: ProxyEdit): Promise<Result> {
    const data = await this.service.createProxy(proxy);
    return {
      status: 'success',
      message: '创建成功！',
      body: data,
    };
  }

  @Put('proxies/:id')
  @ApiOperation({ summary: '更新代理' })
  async updateProxy(
    @Body() proxy: ProxyEdit,
    @Param('id', new VerifyIdPipe()) id: string,
  ): Promise<Result> {
    const data = await this.service.updateProxy(id, proxy);
    return {
      status: 'success',
      message: '更新成功！',
      body: data,
    };
  }

  @Delete('proxies/:id')
  @ApiOperation({ summary: '删除代理' })
  async removeProxy(
    @Param('id', new VerifyIdPipe()) id: string,
  ): Promise<Result> {
    await this.service.removeProxy(id);
    return {
      status: 'success',
      message: '删除成功！',
    };
  }
}
