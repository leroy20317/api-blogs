/**
 * @author: leroy
 * @date: 2023-12-06 11:32
 * @description：kodo
 */

import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import * as fs from 'fs';
import mime from 'mime'

// // 创建 七牛 S3 客户端对象
const S3 = new S3Client({
  region: process.env.REGION,
  endpoint: process.env.ENDPOINT,
  credentials: { accessKeyId: process.env.ACCESS_KEY_ID, secretAccessKey: process.env.SECRET_ACCESS_KEY },
  forcePathStyle: true, // 对于非 AWS S3 兼容服务，通常需要设置为 true
});

// 文件上传
export function fileUpload(key, localFile) {
  return S3.send(
    new PutObjectCommand({
      Bucket: process.env.BUCKET,
      ContentType: mime.getType(localFile),
      Key: key,
      Body: fs.createReadStream(localFile),
    }),
  );
}

// 文件删除
export function fileDelete(key) {
  return S3.send(
    new DeleteObjectCommand({
      Bucket: process.env.BUCKET,
      Key: key,
    }),
  );
}
