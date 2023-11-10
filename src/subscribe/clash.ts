/**
 * @author: leroy
 * @date: 2023-11-08 18:06
 * @description：clash
 */
import { HttpException } from '@nestjs/common';
import { createHash } from 'crypto';
import axios from 'axios';
import * as yaml from 'js-yaml';
import * as dayjs from 'dayjs';
import type Service from './service';
import { Base64 } from 'js-base64';
import { ClashParamsDto } from './controller';
import { Mode } from './enum';

// 解码链接
const decode = {
  sockBoom(str) {
    return {
      proxies: Base64.decode(str)
        .split(/\r?\n/)
        .map(item => {
          const [type, val] = item.split('://');
          try {
            const [server, port, protocol, cipher, obfs, password, paramsStr] =
              Base64.decode(val).split(/:|\/\?/);
            const params: Record<string, string> = paramsStr
              .split('&')
              .reduce((prev, current) => {
                const [key, value] = current.split('=');
                prev[key] = Base64.decode(value);
                return prev;
              }, {});
            return {
              type,
              server,
              port: Number(port),
              protocol,
              cipher,
              obfs,
              password: Base64.decode(password),
              name: params.remarks,
              'protocol-param': params.protoparam,
              'obfs-param': params.obfsparam,
              udp: true,
            };
          } catch (e) {
            return undefined;
          }
        })
        .filter(ele => !!ele),
    };
  },
  oneDollar(str) {
    return {
      proxies: Base64.decode(str)
        .split(/\r?\n/)
        .map(item => {
          const [type, val] = item.split('://');
          try {
            const [href, option] = val.split('?');
            const [password, server, port] = href.split(/@|:/);
            const {
              allowInsecure,
              sni,
              type: remark,
            } = Object.fromEntries(new URLSearchParams(option));
            const [network, name] = remark.split('#');
            const params: Record<string, string | number | boolean> = {
              name,
              type,
              server,
              port: Number(port),
              password,
              sni,
              udp: true,
            };
            if (network === 'ws') {
              params.network = network;
            }
            if (allowInsecure === '1') {
              params['skip-cert-verify'] = true;
            }
            return params;
          } catch (e) {
            return undefined;
          }
        })
        .filter(ele => !!ele),
    };
  },
};

export default async function handleClash(
  query: ClashParamsDto,
  res,
  service: Service,
) {
  if (!query.token) {
    throw new HttpException(`token不能为空!`, 500);
  }
  const token = createHash('sha256').update(query.token).digest('hex');
  const config = JSON.parse(JSON.stringify(await service.findClashConfig()));
  if (token !== config.token) {
    throw new HttpException(`token校验失败!`, 500);
  }
  const url = config.fetchUrl[query.type || 'sockBoom'];
  if (!url) {
    throw new HttpException(`url为空!`, 500);
  }

  console.time('clashUrl');
  console.time('rules');
  try {
    const [{ data, headers }, rules, types, modes] = await Promise.all([
      axios.get(url, { timeout: 30000 }).finally(() => {
        console.timeEnd('clashUrl');
      }),
      service.findRuleList().finally(() => {
        console.timeEnd('rules');
      }),
      service.findTypeList(),
      service.findModeList(),
    ]);
    delete config.token;
    delete config.fetchUrl;
    const { proxies }: any = decode[query.type || 'sockBoom'](data);
    // 写入节点
    config.proxies = proxies;
    const customProxies = await service.findProxyList();
    if (customProxies.length > 0) config.proxies.push(...customProxies);

    // 节点名称
    const names = config.proxies.map(item => item.name);

    // 写入选项
    config['proxy-groups'].forEach(item => {
      const clashType = types.find(ele => ele.name === item.name);
      if (clashType?.write) {
        item.proxies = item.proxies.concat(names);
      }
    });

    // 规则集
    const ruleProviders = {};

    // 写入rules
    config.rules = rules.map(item => {
      const mode = modes.find(ele => ele.id === item.mode).name;
      const type = types.find(ele => ele.id === item.type).name;
      const list = [mode, item.site, type];
      if (item.mode === Mode['RULE-SET']) {
        // 写入规则集
        const key = item.site.split(/[\/|.]/).at(-2);
        ruleProviders[key] = {
          behavior: 'classical',
          type: 'http',
          url: item.site,
          interval: 86400,
          path: `./ACL4SSR/${key}.yaml`,
        };
        list.splice(1, 1, key);
      }
      if (item.resolve === '0') list.push('no-resolve');
      return list.join(',');
    });

    // 写入规则集
    config['rule-providers'] = ruleProviders;

    // 写入match规则
    config.rules.push(`MATCH,🐟 漏网之鱼`);

    if (headers['subscription-userinfo']) {
      const { upload, download, total, expire } = headers[
        'subscription-userinfo'
      ]
        .split('; ')
        .reduce<{
          upload?: number;
          download?: number;
          total?: number;
          expire?: number;
        }>((prev, current) => {
          const [key, value] = current.split('=');
          prev[key] = Number(value);
          return prev;
        }, {});
      const format = num => (num / 1024 / 1024 / 1024).toFixed(1);
      if (upload && download && total && expire) {
        // 写入用量
        config['proxy-groups'].push({
          name: `🔒 使用统计 ${format(upload + download)}G / ${format(total)}G`,
          type: 'select',
          proxies: ['REJECT'],
        });
        config['proxy-groups'].push({
          name: `✈️ 过期时间 ${dayjs(expire * 1000).format('YYYY-MM-DD')}`,
          type: 'select',
          proxies: ['REJECT'],
        });
      }
      res.setHeader('Subscription-Userinfo', headers['subscription-userinfo']);
    }

    res.setHeader('Content-Type', 'text/plain;charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="Custom"`);
    res.send(yaml.dump(config));
  } catch (err) {
    throw new HttpException(
      err?.response?.data || err.message || `规则生成失败`,
      500,
    );
  }
}
