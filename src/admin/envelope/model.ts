import {prop} from '@typegoose/typegoose'

export default class Envelope {

  @prop() // md内容
  content: string

  @prop() // 内容源码
  contentHtml: string

  @prop()
  time: string

}