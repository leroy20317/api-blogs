import '../../utils/env';
import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FileDto, DeleteBodyDto } from './dto';
import * as multer from 'multer';
import { join } from 'path';
import * as fs from 'fs';
import { formatNow, Result } from '../../utils/util';
import { fileUpload, fileDelete } from '../../utils/cdn';

const { diskStorage } = multer;

const isPro = process.env.NODE_ENV === 'production';
const baseStaticPath = isPro ? '/wwwroot/static/' : join(__dirname, '../../');

@ApiBearerAuth()
@ApiTags('后台/文件相关')
@Controller('admin/file')
export default class FilesController {
  @Post('upload/:type')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FileDto, description: '文件上传' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const name = file.mimetype.includes('image') ? 'image' : 'music';
          const date = formatNow().split(' ')[0];
          const path = `${baseStaticPath}uploads/${name}/${date}`;
          console.log('path', path);
          if (!fs.existsSync(path)) {
            fs.mkdirSync(path, { recursive: true });
          }
          cb(null, path);
        },
        filename: (req, file, cb) => {
          const temp = file.originalname.split('.');
          const lastName = '.' + temp.pop();
          const fileName = Date.now() + lastName;
          cb(null, fileName);
        },
      }),
    }),
  )
  async uploadFile(
    @UploadedFile() file: any,
    @Param('type') type: 'base' | 'cdn',
  ): Promise<Result> {
    if (file.size > 10 * 1024 * 1024) {
      throw new BadRequestException(`文件大小不要超过10M！`);
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
    const localFile: string = file.path.replace(/\\/g, '/');
    const fileUrl = localFile.replace(
      /(.*)\/uploads\/(.*)/,
      (match, $1, $2) => `uploads/${$2}`,
    );
    switch (type) {
      case 'base':
        // 服务器
        console.log(`上传文件至 https://static.leroytop.com/${fileUrl} 成功`);
        return {
          status: 'success',
          message: '上传成功！',
          body: {
            url: `//static.leroytop.com/${fileUrl}`,
            filename: file.filename,
          },
        };
      case 'cdn':
        // cdn
        try {
          await fileUpload(fileUrl, localFile);
          console.log(`上传文件至 https://cdn.leroytop.com/${fileUrl} 成功`);
          return {
            status: 'success',
            message: '上传成功！',
            body: {
              url: `https://cdn.leroytop.com/${fileUrl}`,
              filename: file.filename,
            },
          };
        } catch (error) {
          console.log(error);
          throw new BadRequestException('上传失败！');
        }
      default:
        throw new BadRequestException(`type: ${type} 上传模式错误！`);
    }
  }

  @Post('delete/:type')
  @ApiOperation({ summary: '删除文件' })
  async deleteFile(
    @Body() body: DeleteBodyDto,
    @Param('type') type: 'base' | 'cdn',
  ): Promise<Result> {
    if (!body.url) {
      throw new BadRequestException('文件链接不能为空！');
    }
    const fileUrl = body.url.replace(
      /(.*)\/uploads\/(.*)/,
      (match, $1, $2) => `uploads/${$2}`,
    );
    const localFile = `${baseStaticPath}/${fileUrl}`;
    switch (type) {
      case 'base':
        // 服务器
        fs.unlinkSync(localFile);
        return {
          status: 'success',
          message: '删除成功！',
        };
      case 'cdn':
        // cdn
        try {
          fs.unlinkSync(localFile);
        } catch (e) {
          console.log(`delete ${localFile} err`, e);
        }
        try {
          await fileDelete(fileUrl);
          return {
            status: 'success',
            message: '删除成功！',
          };
        } catch (e) {
          console.log(e);
          throw new BadRequestException('删除失败！');
        }
      default:
        throw new BadRequestException(`type: ${type} 模式错误！`);
    }
  }
}
