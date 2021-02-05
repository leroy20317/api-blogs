import {ApiProperty} from "@nestjs/swagger";

export default class UpdateDto {

  @ApiProperty({description: '内容md', required: false})
  content?: string

  @ApiProperty({description: '内容html', required: false})
  contentHtml?: string

  @ApiProperty({description: '发布时间', required: false})
  time?: string

}
