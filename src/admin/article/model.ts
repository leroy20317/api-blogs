import {prop} from '@typegoose/typegoose'

class File {
  @prop({default: ''})
  url: string

  @prop({default: ''})
  name: string
}

export default class Article {

  @prop() // 标题
  title: string

  @prop() // md内容
  content: string

  @prop() // 描述
  describe: string

  @prop()
  time: string

  @prop({default: 0}) // 点赞
  like: number

  @prop({default: 0}) // 阅读
  read: number

  @prop({default: false}) // 隐藏
  hide: boolean

  @prop({default: {url: '', name: ''}, _id: false}) // 音乐
  music: File

  @prop({default: {url: '', name: ''}, _id: false}) // 封面
  image: File

}
