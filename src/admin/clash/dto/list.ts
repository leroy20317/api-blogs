import {ApiProperty} from "@nestjs/swagger";

export default class List {
  @ApiProperty({description: '页数', required: false})
  page?: number;

  @ApiProperty({description: '条数', required: false})
  size?: number;
}
