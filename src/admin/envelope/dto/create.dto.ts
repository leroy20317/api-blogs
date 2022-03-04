import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";

export default class CreateDto {

  @ApiProperty({description: '内容md'})
  @IsNotEmpty({message: '内容md不能为空！'})
  content: string

  @ApiProperty({description: '发布时间'})
  @IsNotEmpty({message: '发布时间不能为空！'})
  time: string

}
