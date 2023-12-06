import { prop } from '@typegoose/typegoose';

class Admin {
  @prop() // 管理员昵称
  name: string;

  @prop() // 管理员头像
  avatar: string;
}

class Web {
  @prop() // 网站地址
  address: string;

  @prop() // 网站名
  name: string;

  @prop({ default: '' }) // 网站描述
  description: string;

  @prop({ default: '' }) // 网站关键词
  seo: string;

  @prop({ default: '' }) // 备案号
  icp: string;
}

class Cover {
  @prop() // 日期
  date: string;

  @prop() // 标题
  title: string;

  @prop() // 链接
  link: string;

  @prop() // 色调
  color: string;

  @prop() // 图片
  image: string;

  @prop() // 描述
  description: string;
}

class Music {
  @prop() // 文章列表
  mood: string;

  @prop() // 自我介绍
  about: string;

  @prop() // 短语
  letter: string;
}

class Comment {
  @prop() // 管理员评论名称
  name: string;

  @prop() // 管理员评论邮箱
  email: string;

  @prop() // 前台展示评论标记
  mark: string;
}

export default class Info {
  @prop({ _id: false }) // 管理页面
  admin: Admin;

  @prop({ _id: false }) // 前台页面
  web: Web;

  @prop({ _id: false }) // 首屏效果
  cover: Cover;

  @prop({ _id: false, default: { mood: '', about: '', letter: '' } }) // 背景音乐
  bg_music: Music;

  @prop({ _id: false }) // 评论相关
  comment: Comment;
}
