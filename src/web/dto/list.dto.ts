import {ApiProperty} from "@nestjs/swagger";

export class ListDto {
  @ApiProperty({description: '页数', required: false})
  page?: number;

  @ApiProperty({description: '条数', required: false})
  size?: number;

}

export class ArticleListDto extends ListDto {
  @ApiProperty({description: '文章列表页数据', required: false})
  mood?: number;
}
