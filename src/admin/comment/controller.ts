import {Body, Controller, Delete, Get, Param, Post, Query} from '@nestjs/common';
import {ApiBearerAuth, ApiOperation, ApiTags} from '@nestjs/swagger'
import ListDto from "./dto/list.dto";
import {ReplayDto} from "./dto/comment.dto";
import Service from "./service";
import VerifyIdPipe from "../../pipe/verify-id.pipe";
import IdListDto from "./dto/ids.dto";
import {Result} from "../../utils/util";

@ApiBearerAuth()
@Controller('admin/comment')
@ApiTags('后台/评论')
export default class CommentController {
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

  @Post('replay/:id')
  @ApiOperation({summary: '回复'})
  async replay(@Param('id', new VerifyIdPipe()) id: string, @Body() replay: ReplayDto): Promise<Result> {
    const data = await this.service.replay(id, replay);
    return {
      status: 'success',
      message: '回复成功！',
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

  @Post('read')
  @ApiOperation({summary: '一键已读'})
  async read(@Body() body: IdListDto): Promise<Result> {
    await this.service.read(body.ids);
    return {
      status: 'success',
      message: '操作成功！',
    }
  }

}
