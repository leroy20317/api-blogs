import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class List {
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

export class Edit {
  @ApiProperty({ description: '模式' })
  @IsNotEmpty({ message: '模式不能为空！' })
  mode: string;

  @ApiProperty({ description: '站点' })
  @IsNotEmpty({ message: '站点不能为空！' })
  site: string;

  @ApiProperty({ description: '类型' })
  @IsNotEmpty({ message: '类型不能为空！' })
  type: string;

  @ApiProperty({ description: 'resolve', default: '1' })
  resolve: '0' | '1';

  @ApiProperty({ description: '备注', default: '' })
  remark: string;
}
