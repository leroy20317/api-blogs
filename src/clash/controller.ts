import { Controller, Get, HttpException, Query, Res } from '@nestjs/common';
import { ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import Service from './service';
import { NoAuth } from '../auth/customize.decorator';
import axios from 'axios';
import * as yaml from 'js-yaml';
import { Response } from 'express';
import * as dayjs from 'dayjs';
import { createHash } from 'crypto';

class ParamsDto {
  @ApiProperty({ description: 'token', required: false })
  token: string;
  @ApiProperty({ description: '订阅链接', required: false })
  clashUrl: string;
}

@Controller('clash')
@ApiTags('clash订阅')
export default class ClashController {
  constructor(private readonly service: Service) {}

  @NoAuth('never')
  @Get()
  @ApiOperation({ summary: '订阅' })
  async index(@Query() query: ParamsDto, @Res() res: Response): Promise<any> {
    if (!query.clashUrl && !query.token) {
      throw new HttpException(`clashUrl不能为空`, 500);
    }

    const token =
      query.token && createHash('sha256').update(query.token).digest('hex');
    const defaultConfig = await this.service.findConfig();

    const flag = token === defaultConfig.token;
    const clashUrl = flag ? defaultConfig.clashUrl : query.clashUrl;
    try {
      const [{ data, headers }, rules, types, modes, proxies] =
        await Promise.all([
          axios.get(clashUrl),
          this.service.findRuleList(),
          this.service.findTypeList(),
          this.service.findModeList(),
          this.service.findProxyList(),
        ]);
      const config = JSON.parse(JSON.stringify(defaultConfig));
      delete config.token;
      delete config.clashUrl;
      const urlJson: any = yaml.load(data);

      // 写入节点
      config.proxies = urlJson.proxies;
      if (flag && proxies.length > 0) {
        config.proxies.push(...proxies);
      }

      // 节点名称
      const names = config.proxies.map(item => item.name);

      // 写入选项
      config['proxy-groups'].forEach(item => {
        const clashType = types.find(ele => ele.name === item.name);
        if (clashType?.write) {
          item.proxies = item.proxies.concat(names);
        }
      });

      // 写入rules
      config.rules = rules.map(item => {
        const mode = modes.find(ele => ele.id === item.mode).name;
        const type = types.find(ele => ele.id === item.type).name;
        const list = [mode, item.site, type];
        if (item.resolve === '0') list.push('no-resolve');
        return list.join(',');
      });

      // 写入match规则
      config.rules.push(
        `${modes.find(ele => ele.id === '7').name},${
          types.find(ele => ele.id === '12').name
        }`,
      );

      res.setHeader('Content-Type', headers['content-type'] || 'text/plain');
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
            name: `🔒 使用统计 ${format(upload + download)}G / ${format(
              total,
            )}G`,
            type: 'select',
            proxies: ['REJECT'],
          });
          config['proxy-groups'].push({
            name: `✈️ 过期时间 ${dayjs(expire * 1000).format('YYYY-MM-DD')}`,
            type: 'select',
            proxies: ['REJECT'],
          });
        }
      }
      res.setHeader('Subscription-Userinfo', headers['subscription-userinfo']);
      res.send(yaml.dump(config));
    } catch (err) {
      throw new HttpException(
        err?.response?.data || err.message || `规则生成失败`,
        500,
      );
    }
  }
}
