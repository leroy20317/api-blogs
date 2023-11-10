import { modelOptions, prop } from '@typegoose/typegoose';

@modelOptions({ options: { customName: 'clash_configs' } })
export class ClashConfig {
  @prop()
  port: number;

  @prop()
  'socks-port': number;

  @prop()
  'allow-lan': boolean;

  @prop()
  mode: string;

  @prop()
  'log-level': string;

  @prop()
  'external-controller': string;

  @prop()
  proxies: Record<string, any> & { name: string };

  @prop()
  'proxy-groups': {
    name: string;
    type: string;
    proxies: string[];
  }[];

  @prop()
  rules: string[];

  @prop()
  token: string;

  @prop()
  fetchUrl: {
    sockBoom: string;
    oneDollar: string;
  };
}

@modelOptions({ options: { customName: 'subscribe_rules' } })
export class SubscribeRule {
  @prop() // 模式
  mode: string;

  @prop() // 站点
  site: string;

  @prop() // 类型
  type: string;

  @prop() // resolve
  resolve: '0' | '1';

  @prop() // 备注
  remark: string;
}

@modelOptions({ options: { customName: 'subscribe_modes' } })
export class SubscribeMode {
  @prop() // id
  id: string;

  @prop() // 模式名称
  name: string;
}

@modelOptions({ options: { customName: 'subscribe_types' } })
export class SubscribeType {
  @prop() // id
  id: string;

  @prop() // 类型名称
  name: string;

  @prop() // 是否写入规则
  write: boolean;
}

@modelOptions({ options: { customName: 'subscribe_proxies' } })
export class SubscribeProxy {
  @prop() // name
  content: Record<string, any>;
}
