import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";

export class ReplayDto {

  @ApiProperty({description: '内容'})
  @IsNotEmpty({message: '内容不能为空！'})
  content: string

  @ApiProperty({description: '回复对象', default: ''})
  reply_name: string

  @ApiProperty({description: '回复邮箱', default: ''})
  reply_email: string

}
