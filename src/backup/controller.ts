import {Controller, Get} from '@nestjs/common';
import {ApiBearerAuth, ApiOperation, ApiTags} from '@nestjs/swagger';
import {Result} from 'src/utils/util';
import Service from './service';
import {NoAuth} from '../auth/customize.decorator';

@ApiBearerAuth()
@Controller('backup/mongo')
@ApiTags('备份')
export default class BackUpController {
  constructor(private readonly service: Service) {
  }

  @NoAuth('never')
  @Get()
  @ApiOperation({summary: '数据库备份'})
  async index(): Promise<Result> {
    const data = await this.service.backup();

    return {
      status: 'success',
      body: data,
    };
  }
}
