import {prop} from '@typegoose/typegoose'

export default class Envelope {

  @prop() // md内容
  content: string

  @prop()
  time: string

}
