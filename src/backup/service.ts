import {Injectable, Logger} from '@nestjs/common';
import {Cron, CronExpression} from '@nestjs/schedule';
import '../utils/env';
import * as childProcess from 'child_process';
import {formatNow} from '../utils/util';
import * as qiniu from 'qiniu';

const {exec} = childProcess;
const {
  NODE_ENV,
  MONGO_PORT,
  MONGO_HOST,
  MONGO_DB,
  MONGO_USER,
  MONGO_PASSWORD,
  ACCESSKEY,
  SECRETKEY,
} = process.env;
const isPro = NODE_ENV === 'production';

const mac = new qiniu.auth.digest.Mac(ACCESSKEY, SECRETKEY);
const qiniu_config = new qiniu.conf.Config({
  useCdnDomain: true, // cdn加速
  zone: qiniu.zone.Zone_z2, // 华南
});

async function kodoUpload(filePath: string, fileUrl: string): Promise<any> {
  const options = {scope: 'leroy20317', expires: 7200};
  const putPolicy = new qiniu.rs.PutPolicy(options);
  const uploadToken = putPolicy.uploadToken(mac);

  const formUploader = new qiniu.form_up.FormUploader(qiniu_config);
  const putExtra = new qiniu.form_up.PutExtra();
  return new Promise((resolve, reject) => {
    // 文件上传
    formUploader.putFile(
        uploadToken,
        fileUrl,
        filePath,
        putExtra,
        function (respErr, respBody, respInfo) {
          putExtra.mimeType = null; // 重置MIME类型
          if (respErr) {
            reject(respErr);
            throw respErr;
          }
          resolve(respBody);
          if (respInfo.statusCode === 200) {
            // console.log(respBody);
          } else {
            console.log('kodoUpload', {code: respInfo.statusCode, respBody});
          }
        },
    );
  });
}

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
  'mongodump -h 1.116.106.57:20317 -u root -p lx09120317 --authenticationDatabase admin -d blogs --gzip -o /wwwroot/mongo-backup/1'
  'mongodump -h 1.116.106.57:20317 -d blogs -o /wwwroot/mongo-backup/1'

  backup() {
    const backUpFolder = isPro ? '/wwwroot/mongo-backup' : './mongo-backup';

    // 备份文件名带上日期信息，避免重名，并方便识别
    const backFileName = formatNow().split(' ')[0];

    const cmdStr = isPro
        ? `
      # 正式环境
      
      # 导出 数据库
      mongodump -h ${MONGO_HOST}:${MONGO_PORT} -u ${MONGO_USER} -p ${MONGO_PASSWORD} --authenticationDatabase admin -d ${MONGO_DB} -o ${backUpFolder}/${backFileName}
      
      # 进入备份文件夹
      cd ${backUpFolder}
      
      # 压缩导出的数据
      tar zcvf ${backFileName}.tar.gz ${backFileName}
      
      # 删除文件夹，只保留备份的压缩包
      rm -rf ${backFileName}
    `
        : `
      # 测试环境
      
      # 模拟创建数据库文件夹
      mkdir -p ${backUpFolder}/${backFileName}
      
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

          const filePath = `${backUpFolder}/${backFileName}.tar.gz`;
          const fileUrl = `mongo-backup/${backFileName}.tar.gz`;

          try {
            await kodoUpload(filePath, fileUrl);
            console.log(`上传文件至 https://cdn.leroy.net.cn/${fileUrl} 成功`);
            resolve({
              filename: `${backFileName}.tar.gz`,
              url: `https://cdn.leroy.net.cn/${fileUrl}`,
            });
          } catch (e) {
            console.log('kodo e', e);
            reject(e);
          }
        }
      });
    });
  }
}
