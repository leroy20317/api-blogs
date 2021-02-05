import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";

export default class AboutDto {

  @ApiProperty({description: '内容md'})
  @IsNotEmpty({message: '内容md不能为空！'})
  content: string

  @ApiProperty({description: '内容html'})
  @IsNotEmpty({message: '内容html不能为空！'})
  contentHtml: string

}
