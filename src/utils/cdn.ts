/**
 * @author: leroy
 * @date: 2023-12-06 11:32
 * @description：kodo
 */

import { S3, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import * as fs from 'fs';

// // 创建 七牛 S3 客户端对象
const kodoClient = new S3({
  region: 'z2',
  endpoint: 'https://s3.cn-south-1.qiniucs.com',
  credentials: {
    accessKeyId: process.env.ACCESSKEY,
    secretAccessKey: process.env.SECRETKEY,
  },
});

// 文件上传
export function fileUpload(key, localFile) {
  return kodoClient.send(
    new PutObjectCommand({
      Bucket: 'leroy20317',
      Key: key,
      Body: fs.createReadStream(localFile),
    }),
  );
}

// 文件删除
export function fileDelete(key) {
  return kodoClient.send(
    new DeleteObjectCommand({
      Bucket: 'leroy20317',
      Key: key,
    }),
  );
}
