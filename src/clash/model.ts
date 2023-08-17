import {modelOptions, prop} from '@typegoose/typegoose'

@modelOptions({ options: { customName: "clash_configs"  } })
export class ClashConfig {

  @prop()
  port: number

  @prop()
  'socks-port': number

  @prop()
  'allow-lan': boolean

  @prop()
  mode: string

  @prop()
  'log-level': string

  @prop()
  'external-controller': string

  @prop()
  proxies: Record<string, any> & {name: string}

  @prop()
  'proxy-groups': {
    name: string;
    type: string;
    proxies: string[];
  }[]

  @prop()
  rules: string[]

}

@modelOptions({ options: { customName: "clash_rules" } })
export class ClashRule {

  @prop() // 模式
  mode: string

  @prop() // 站点
  site: string

  @prop() // 类型
  type: string

  @prop() // resolve
  resolve: boolean

  @prop() // 备注
  remark: string
}

@modelOptions({ options: { customName: "clash_modes" } })
export class ClashMode {
  @prop() // id
  id: string

  @prop() // 模式名称
  name: string
}


@modelOptions({ options: { customName: "clash_types" } })
export class ClashType {
  @prop() // id
  id: string

  @prop() // 类型名称
  name: string

  @prop() // 是否写入规则
  write: 0|1
}
