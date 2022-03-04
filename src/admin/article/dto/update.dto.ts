import {ApiProperty} from "@nestjs/swagger";

class FileDto {
  @ApiProperty({description: '链接', required: false})
  url: string

  @ApiProperty({description: '名称', required: false})
  name?: string
}

export default class UpdateDto {
  @ApiProperty({description: '标题', required: false})
  title?: string

  @ApiProperty({description: '内容md', required: false})
  content?: string

  @ApiProperty({description: '描述', required: false})
  describe?: string

  @ApiProperty({description: '发布时间', required: false})
  time?: string

  @ApiProperty({description: '是否隐藏', required: false})
  hide?: boolean

  @ApiProperty({description: '音乐', required: false})
  music?: FileDto

  @ApiProperty({description: '封面', required: false})
  image?: FileDto

}
