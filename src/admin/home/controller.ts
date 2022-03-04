import {Controller, Get} from '@nestjs/common';
import {ApiBearerAuth, ApiOperation, ApiTags} from '@nestjs/swagger'
import Service from "./service";
import {NoAuth} from "../../auth/customize.decorator";
import {Result} from "../../utils/util";

@ApiBearerAuth()
@Controller('admin/home')
@ApiTags('后台/主页')
export default class InfoController {
  constructor(private readonly service: Service) {
  }

  @NoAuth()
  @Get()
  @ApiOperation({summary: '主页'})
  async index(): Promise<Result> {
    const [articleLast, articleLength, envelope, comments] = await this.service.find();

    const data = {
      article: {
        last: articleLast,
        length: articleLength
      },
      envelope: envelope,
      comment: comments,
    }
    return {
      status: 'success',
      body: data
    }
  }

}
