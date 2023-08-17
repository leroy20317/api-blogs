import {ApiProperty} from "@nestjs/swagger";

export default class Update {

  @ApiProperty({description: '内容md', required: false})
  content?: string

  @ApiProperty({description: '发布时间', required: false})
  time?: string

}
