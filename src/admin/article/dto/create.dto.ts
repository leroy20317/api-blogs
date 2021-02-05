import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";

class FileDto {
  @ApiProperty({description: '链接'})
  @IsNotEmpty({message: '链接不能为空！'})
  url: string

  @ApiProperty({description: '名称'})
  name?: string
}

export default class CreateDto {
  @ApiProperty({description: '标题'})
  @IsNotEmpty({message: '标题不能为空！'})
  title: string

  @ApiProperty({description: '字数'})
  @IsNotEmpty({message: '字数不能为空！'})
  words: number

  @ApiProperty({description: '内容md'})
  @IsNotEmpty({message: '内容md不能为空！'})
  content: string

  @ApiProperty({description: '内容html'})
  @IsNotEmpty({message: '内容html不能为空！'})
  contentHtml: string

  @ApiProperty({description: '描述'})
  @IsNotEmpty({message: '描述不能为空！'})
  describe: string

  @ApiProperty({description: '发布时间'})
  @IsNotEmpty({message: '发布时间不能为空！'})
  time: string

  @ApiProperty({description: '是否隐藏'})
  @IsNotEmpty({message: '是否隐藏不能为空！'})
  hide: boolean

  @ApiProperty({description: '音乐'})
  music?: FileDto

  @ApiProperty({description: '封面'})
  @IsNotEmpty({message: '封面不能为空！'})
  image: FileDto

}