import {Body, Controller, Get, HttpException, Post} from '@nestjs/common';
import {ApiBearerAuth, ApiOperation, ApiTags} from '@nestjs/swagger'
import InfoDto from "./dto";
import Service from "./service";
import {Result} from "../../utils/util";

@ApiBearerAuth()
@Controller('admin/info')
@ApiTags('后台/页面设置')
export default class InfoController {
  constructor(private readonly service: Service) {
  }

  @Get()
  @ApiOperation({summary: '详情'})
  async index(): Promise<Result> {
    const data = await this.service.find();
    if (!data) {
      throw new HttpException(`还未填写相关页面设置！`, 404);
    }
    return {
      status: 'success',
      body: data
    }
  }

  @Post()
  @ApiOperation({summary: '填写'})
  async update(@Body() about: InfoDto): Promise<Result> {
    const data = await this.service.update(about);
    return {
      status: 'success',
      message: '提交成功！',
      body: data
    }
  }


}
