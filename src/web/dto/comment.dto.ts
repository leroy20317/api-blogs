import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";

export class CommentDto {

  @ApiProperty({description: '昵称'})
  @IsNotEmpty({message: '昵称不能为空！'})
  name: string

  @ApiProperty({description: '邮箱'})
  @IsNotEmpty({message: '邮箱不能为空！'})
  email: string

  @ApiProperty({description: '头像id', default: 1})
  @IsNotEmpty({message: '头像不能为空！'})
  image: number

  @ApiProperty({description: '内容'})
  @IsNotEmpty({message: '内容不能为空！'})
  content: string

}

export class ReplayDto extends CommentDto {

  @ApiProperty({description: '回复对象', default: ''})
  reply_name: string

  @ApiProperty({description: '回复邮箱', default: ''})
  reply_email: string

}
