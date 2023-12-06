import { ApiProperty } from '@nestjs/swagger';

export class FileDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}

export class DeleteBodyDto {
  @ApiProperty({ description: '文件链接' })
  url: string;
}
