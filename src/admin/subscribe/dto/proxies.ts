import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class List {
  @ApiProperty({ description: '页数', required: false })
  page?: number;

  @ApiProperty({ description: '条数', required: false })
  size?: number;
}

export class Edit {
  @ApiProperty({ description: '内容' })
  @IsNotEmpty({ message: '内容不能为空！' })
  content: Record<string, any>;
}
