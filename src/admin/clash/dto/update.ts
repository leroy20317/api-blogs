import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";

export default class Update {

  @ApiProperty({description: '模式'})
  @IsNotEmpty({message: '模式不能为空！'})
  mode: number

  @ApiProperty({description: '站点'})
  @IsNotEmpty({message: '站点不能为空！'})
  site: string

  @ApiProperty({description: '类型'})
  @IsNotEmpty({message: '类型不能为空！'})
  type: number

  @ApiProperty({description: 'resolve', default: false})
  resolve: boolean

  @ApiProperty({description: '备注', default: ''})
  remark: string

}
