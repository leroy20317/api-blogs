import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

class Admin {
  @ApiProperty({ description: '管理员昵称' })
  @IsNotEmpty({ message: '管理员昵称不能为空！' })
  name: string;

  @ApiProperty({ description: '管理员头像' })
  @IsNotEmpty({ message: '管理员头像不能为空！' })
  avatar: string;
}

class Web {
  @ApiProperty({ description: '网站地址' })
  @IsNotEmpty({ message: '网站地址不能为空！' })
  address: string;

  @ApiProperty({ description: '网站名' })
  @IsNotEmpty({ message: '网站名不能为空！' })
  name: string;

  @ApiProperty({ description: '网站描述', required: false })
  description: string;

  @ApiProperty({ description: '网站关键词', required: false })
  seo: string;

  @ApiProperty({ description: '备案号', required: false })
  icp: string;
}

class Cover {
  @ApiProperty({ description: '日期' })
  @IsNotEmpty({ message: '日期不能为空！' })
  date: string;

  @ApiProperty({ description: '标题' })
  @IsNotEmpty({ message: '标题不能为空！' })
  title: string;

  @ApiProperty({ description: '链接' })
  @IsNotEmpty({ message: '链接不能为空！' })
  link: string;

  @ApiProperty({ description: '色调' })
  @IsNotEmpty({ message: '色调不能为空！' })
  color: string;

  @ApiProperty({ description: '图片' })
  @IsNotEmpty({ message: '图片不能为空！' })
  image: string;

  @ApiProperty({ description: '描述' })
  @IsNotEmpty({ message: '描述不能为空！' })
  description: string;
}

class Music {
  @ApiProperty({ description: '文章列表背景音乐', required: false })
  mood: string;

  @ApiProperty({ description: '自我介绍背景音乐', required: false })
  about: string;

  @ApiProperty({ description: '短语背景音乐', required: false })
  letter: string;
}

class Comment {
  @ApiProperty({ description: '管理员评论名称' })
  @IsNotEmpty({ message: '管理员评论名称不能为空！' })
  name: string;

  @ApiProperty({ description: '管理员评论邮箱' })
  @IsNotEmpty({ message: '管理员评论邮箱不能为空！' })
  email: string;

  @ApiProperty({ description: '前台展示评论标记' })
  @IsNotEmpty({ message: '前台展示评论标记不能为空！' })
  mark: string;
}

export default class InfoDto {
  @ApiProperty({ description: '管理页面' })
  admin: Admin;

  @ApiProperty({ description: '前台页面' })
  web: Web;

  @ApiProperty({ description: '首屏效果' })
  cover: Cover;

  @ApiProperty({ description: '背景音乐' })
  bg_music: Music;

  @ApiProperty({ description: '评论相关' })
  comment: Comment;
}
