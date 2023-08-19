import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export default class Create {
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

  @ApiProperty({ description: '备注' })
  remark: string;
}
