import {ApiProperty} from "@nestjs/swagger";

export default class IdListDto {
  @ApiProperty({description: 'id列表', default: []})
  ids: string[];
}
