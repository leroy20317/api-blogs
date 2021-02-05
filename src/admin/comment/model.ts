import {prop} from '@typegoose/typegoose'

export default class Comment {

  @prop() // 文章id
  article_id: string

  @prop() // 昵称
  name: string

  @prop() // 邮箱
  email: string

  @prop() // 头像id
  image: number

  @prop() // 时间
  time: string

  @prop() // 内容
  content: string

  @prop({default: 1}) // 状态 未读 1  已读 2
  status: number

  @prop({default: 1}) // 类型 1评论 2回复 3深度回复
  type: number

  @prop({default: ''}) // 一级评论id
  parent_id: string

  @prop() // 回复对象
  reply_name: string

  @prop() // 回复邮箱
  reply_email: string

  @prop() // 是否为管理员
  admin: boolean

}