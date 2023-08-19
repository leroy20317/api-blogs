import { Controller, Get, HttpException, Query, Res } from '@nestjs/common';
import { ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import Service from './service';
import { NoAuth } from '../auth/customize.decorator';
import axios from 'axios';
import * as yaml from 'js-yaml';
import { Response } from 'express';
import * as dayjs from 'dayjs';

class ParamsDto {
  @ApiProperty({ description: '订阅链接' })
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
    if (!query.clashUrl) {
      throw new HttpException(`clashUrl不能为空`, 500);
    }

    try {
      const [{ data, headers }, defaultConfig, rules, types, modes] =
        await Promise.all([
          axios.get(query.clashUrl),
          this.service.findConfig(),
          this.service.findRuleList(),
          this.service.findTypeList(),
          this.service.findModeList(),
        ]);

      const config = JSON.parse(JSON.stringify(defaultConfig));
      const urlJson: any = yaml.load(data);

      // 写入节点
      config.proxies = urlJson.proxies;

      // 节点名称
      const names = urlJson.proxies.map(item => item.name);

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
        if (upload && download && total && expire) {
          // 写入用量
          config['proxy-groups'].unshift({
            name: `🔒 使用统计`,
            type: 'select',
            proxies: [
              `总量 ${(total / 1024 / 1024 / 1024).toFixed(1)}G`,
              `下行 ${(download / 1024 / 1024 / 1024).toFixed(1)}G`,
              `上行 ${(upload / 1024 / 1024 / 1024).toFixed(1)}G`,
              `过期 ${dayjs(expire * 1000).format('YYYY-MM-DD')}`,
            ],
          });
        }
      }
      res.setHeader('Subscription-Userinfo', headers['subscription-userinfo']);
      res.send(yaml.dump(config));
    } catch (err) {
      console.log('err', err);
      throw new HttpException(`url解析失败`, 500);
    }
  }
}
