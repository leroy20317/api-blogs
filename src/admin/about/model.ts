import {prop} from '@typegoose/typegoose'

export default class About {

  @prop() // md内容
  content: string

  @prop() // 内容源码
  contentHtml: string

}