import {Body, Controller, Get, Post,} from '@nestjs/common';
import {ApiBearerAuth, ApiOperation, ApiTags} from '@nestjs/swagger';
import {Result} from 'src/utils/util';
import AboutDto from './dto';
import Service from './service';

@ApiBearerAuth()
@Controller('admin/about')
@ApiTags('后台/自我介绍')
export default class AboutController {
  constructor(private readonly service: Service) {
  }

  @Get()
  @ApiOperation({summary: '详情'})
  async index(): Promise<Result> {
    const data = await this.service.find();
    // if (!data) {
    //   throw new HttpException(`还未填写自我介绍！`, 404);
    // }
    return {
      status: 'success',
      body: data,
    };
  }

  @Post()
  @ApiOperation({summary: '填写'})
  async update(@Body() about: AboutDto): Promise<Result> {
    const data = await this.service.update(about);
    return {
      status: 'success',
      message: '提交成功！',
      body: data,
    };
  }
}
