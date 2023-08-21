import { ApiProperty } from '@nestjs/swagger';

export default class List {
  @ApiProperty({ description: '页数', required: false })
  page?: number;

  @ApiProperty({ description: '条数', required: false })
  size?: number;

  @ApiProperty({ description: '模式', required: false })
  mode: string;

  @ApiProperty({ description: '站点', required: false })
  site: string;

  @ApiProperty({ description: '类型', required: false })
  type: string;

  @ApiProperty({ description: 'resolve', required: false })
  resolve: '0' | '1';
}
