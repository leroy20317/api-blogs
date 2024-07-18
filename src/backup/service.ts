import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import '../utils/env';
import * as childProcess from 'child_process';
import { formatNow } from '../utils/util';
import { fileUpload } from '../utils/cdn';

const { exec } = childProcess;
const { NODE_ENV, MONGO_DB, MONGO_USER, MONGO_PASSWORD } = process.env;
const isPro = NODE_ENV === 'production';

@Injectable()
export default class BackupService {
  private readonly logger = new Logger(BackupService.name);

  @Cron(CronExpression.EVERY_WEEK)
  async handleCron() {
    // 每周自动备份
    this.logger.debug('Called Every Week');
    if (!isPro) {
      return;
    }
    await this.backup();
  }

  // @Interval(10000)
  // handleInterval() {
  //   this.logger.debug('Called every 10 seconds');
  // }

  // @Timeout(5000)
  // async handleTimeout(){
  //   this.logger.debug('Called Timeout 5 seconds');
  //   await this.backup();
  // }

  backup() {
    const backUpFolder = '/wwwroot/static/mongo-backup';

    // 备份文件名带上日期信息，避免重名，并方便识别
    const backFileName = formatNow().split(' ')[0];

    // 恢复 --drop清空原有数据
    // docker exec -it mongodb-container /bin/sh mongorestore -h localhost:27017 -u ${MONGO_USER} -p ${MONGO_PASSWORD} --authenticationDatabase admin --drop -d ${MONGO_DB} /backup/${backFileName}/${MONGO_DB}
    const cmdStr = `
      # 正式环境
      
      # 导出 数据库
      docker exec mongodb-container mongodump -h localhost:27017 -u ${MONGO_USER} -p ${MONGO_PASSWORD} --authenticationDatabase admin -d ${MONGO_DB} -o /backup/${backFileName}
      
      # 进入备份文件夹
      cd ${backUpFolder}
      
      # 压缩导出的数据
      tar zcvf ${backFileName}.tar.gz ${backFileName}
      
      # 删除文件夹，只保留备份的压缩包
      rm -rf ${backFileName}
    `;

    return new Promise((resolve, reject) => {
      exec(cmdStr, async function (err, stdout, stderr) {
        // console.log('err,stdout,stderr', {err,stdout,stderr})
        if (err) {
          console.log('cmd error', stderr);
          reject(stderr);
        } else {
          console.log('cmd success', stdout);

          const localFile = `${backUpFolder}/${backFileName}.tar.gz`;
          const fileUrl = `mongo-backup/${backFileName}.tar.gz`;

          try {
            await fileUpload(fileUrl, localFile);
            console.log(`上传文件至 https://cdn.leroytop.com/${fileUrl} 成功`);
            resolve({
              filename: `${backFileName}.tar.gz`,
              url: `https://cdn.leroytop.com/${fileUrl}`,
            });
          } catch (e) {
            console.log('update backup e', e);
            reject(e);
          }
        }
      });
    });
  }
}
