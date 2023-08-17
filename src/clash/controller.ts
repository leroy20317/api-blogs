import {
  Controller,
  Get,
  HttpException,
  Query,
  Res
} from '@nestjs/common';
import { ApiOperation, ApiProperty, ApiTags} from '@nestjs/swagger'
import Service from "./service";
import {NoAuth} from "../auth/customize.decorator";
import axios from "axios";
import * as yaml from 'js-yaml';
import { Response } from 'express';


class ParamsDto  {
  @ApiProperty({description: '订阅链接'})
  clashUrl: string
}


@Controller('clash')
@ApiTags('clash订阅')
export default class ClashController {
  constructor(private readonly service: Service) {
  }

  @NoAuth('never')
  @Get()
  @ApiOperation({summary: '订阅'})
  async index( @Query() query: ParamsDto, @Res() res: Response): Promise<any> {

    if(!query.clashUrl){
      throw new HttpException(`clashUrl不能为空`, 500);
    }

    try {
      const [{data}, defaultConfig, rules, types, modes] = await Promise.all([axios.get(query.clashUrl), this.service.findConfig(), this.service.findRuleList(), this.service.findTypeList(), this.service.findModeList()]);

      const config = JSON.parse(JSON.stringify(defaultConfig))
      const urlJson: any = yaml.load(data);

      // 写入节点
      config.proxies = urlJson.proxies;

      // 节点名称
      const names = urlJson.proxies.map((item) => item.name);

      // 写入选项
      config['proxy-groups'].forEach((item) => {
        const clashType = types.find(ele => ele.name === item.name);
        if(clashType?.write){
          item.proxies = item.proxies.concat(names);
        }
      })

      // 写入rules
      config.rules = rules.map(item => {
        const mode = modes.find(ele => ele.id === item.mode).name;
        const type = types.find(ele => ele.id === item.type).name;
        const list = [mode, item.site, type];
        if(!item.resolve) list.push('no-resolve')
        return list.filter(ele => !!ele).join(',')
      })

      res.setHeader('Content-Type', 'text/plain');
      res.send(yaml.dump(config));
    }catch (err){
      console.log('err', err)
      throw new HttpException(`url解析失败`, 500);
    }
  }

}
