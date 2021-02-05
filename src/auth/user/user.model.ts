import {prop} from '@typegoose/typegoose'

export default class User {

  @prop() // username
  username: string

  @prop() // password
  password: string

}