import { Controller, Get, Query, Res } from '@nestjs/common';
import { ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import Service from './service';
import { NoAuth } from '../auth/customize.decorator';
import { Response } from 'express';
import handleClash from './clash';

export class ClashParamsDto {
  @ApiProperty({ description: 'token', required: false })
  token: string;
  @ApiProperty({ description: '类型', default: 'sockBoom' })
  type?: 'sockBoom' | 'oneDollar';
}

@Controller('subscribe')
@ApiTags('订阅')
export default class SubscribeController {
  constructor(private readonly service: Service) {}

  @NoAuth('never')
  @Get('clash')
  @ApiOperation({ summary: 'clash订阅' })
  async clash(@Query() query: ClashParamsDto, @Res() res: Response) {
    return handleClash(query, res, this.service);
  }
}
