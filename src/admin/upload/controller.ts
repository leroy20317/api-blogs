import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import {FileInterceptor} from '@nestjs/platform-express';
import {ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags} from "@nestjs/swagger";
import FileDto from "./dto";
import {diskStorage} from 'multer'
import config from "../../utils/config";
import {join} from 'path'
import * as fs from "fs";
import * as qiniu from 'qiniu';
import {formatNow, Result} from "../../utils/util";

const accessKey = 'yH-26a9NAohR_QegJR1uGU5I5Dw595l6n_tXHwPB';
const secretKey = 'EcLCXW7hZiaY48qbFP1yU9okc17a12mmQqF9Ipth';

async function kodoUpload(filePath: string, fileUrl: string): Promise<any> {
  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
  const qiniu_config = new qiniu.conf.Config({
    useCdnDomain: true, // cdn加速
    zone: qiniu.zone.Zone_z2, // 华南
  });

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
            console.log(respInfo.statusCode);
            console.log(respBody);
          }
        }
    );
  });
}

async function kodoDelete(fileUrl: string) {
  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
  const bucketManager = new qiniu.rs.BucketManager(mac, config);
  return new Promise((resolve, reject) => {
    bucketManager.delete("leroy20317", fileUrl, function (err, respBody, respInfo) {
      if (err) {
        console.log(err);
        //throw err;
        reject(err)
      } else {
        console.log(respInfo);
        resolve(respInfo)
      }
    });
  })
}

@ApiBearerAuth()
@ApiTags('后台/文件相关')
@Controller('admin/file')
export default class UploadController {

  @Post('upload/:type')
  @ApiConsumes('multipart/form-data')
  @ApiBody({type: FileDto, description: '文件上传'})
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const name = file.mimetype.includes('image') ? 'image' : 'music';
        const date = formatNow().split(' ')[0]
        const path = `${config.isPro ? '/wwwroot/static/uploads' : join(__dirname, '../../uploads')}/${name}/${date}`;
        if (!fs.existsSync(path)) {
          fs.mkdirSync(path, {recursive: true});
        }
        cb(null, path)
      },
      filename: (req, file, cb) => {
        const temp = file.originalname.split('.');
        const lastName = '.' + temp.pop();
        const fileName = Date.now() + lastName;
        cb(null, fileName)
      }
    })
  }))
  async uploadFile(@UploadedFile() file: any, @Param('type') type: '1' | '2'): Promise<Result> {
    if (file.size > 10 * 1024 * 1024) {
      throw new BadRequestException(`文件大小不要超过10M！`)
    }
    // file: {
    //   fieldname: 'file',
    //   originalname: '1574945336javascript.jpg',
    //   encoding: '7bit',
    //   mimetype: 'image/jpeg',
    //   destination: '/Users/leroy/work/demo/nest-api-blogs/dist/uploads/image/2021-02-02',
    //   filename: '1574945336javascript.jpg',
    //   path: '/Users/leroy/work/demo/nest-api-blogs/dist/uploads/image/2021-02-02/1574945336javascript.jpg',
    //   size: 29617
    // }
    const filePath: string = (file.path).replace(/\\/g, "\/");
    const fileUrl = filePath.replace(/(.*)\/uploads\/(.*)/, (match, $1, $2) => `uploads/${$2}`);
    const filename = file.filename;
    switch (type) {
      case "1":
        // 服务器
        console.log(`上传文件至 https://static.leroy.net.cn/${fileUrl} 成功`);
        return {
          status: 'success',
          message: '上传成功！',
          body: {
            url: `//static.leroy.net.cn/${fileUrl}`,
            filename
          }
        }
      case "2":
        // 七牛 KODO
        try {
          await kodoUpload(filePath, fileUrl);
          console.log(`上传文件至 https://cdn.leroy.net.cn/${fileUrl} 成功`);
          return {
            status: 'success',
            message: '上传成功！',
            body: {
              url: `https://cdn.leroy.net.cn/${fileUrl}`,
              filename
            }
          };
        } catch (error) {
          console.log(error);
          throw new BadRequestException('上传失败！')
        } finally {
          fs.unlinkSync(filePath);   // 上传之后删除本地文件
        }
      default:
        throw new BadRequestException(`type: ${type} 上传模式错误！`)
    }
  }

  @Post('delete/:type')
  @ApiOperation({summary: '删除文件'})
  async create(@Body('url') url: string, @Param('type') type: '1' | '2'): Promise<Result> {
    if (!url) {
      throw new BadRequestException('文件链接不能为空！')
    }
    const fileUrl = url.replace(/(.*)\/uploads\/(.*)/, (match, $1, $2) => `uploads/${$2}`)
    switch (type) {
      case "1":
        // 服务器
        const filePath = `${config.isPro ? '/wwwroot/static/' : join(__dirname, '../../')}${fileUrl}`;
        fs.unlinkSync(filePath);
        return {
          status: 'success',
          message: '删除成功！',
        }
      case "2":
        // 七牛KODO
        try {
          await kodoDelete(fileUrl);
          return {
            status: 'success',
            message: '删除成功！',
          }
        } catch (e) {
          console.log(e);
          throw new BadRequestException('删除失败！')
        }
      default:
        throw new BadRequestException(`type: ${type} 模式错误！`)
    }

  }
}
