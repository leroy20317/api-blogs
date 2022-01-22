import {NestFactory} from '@nestjs/core';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import {AppModule} from './app.module';
import './utils/env'
import {ValidationPipe} from "./pipe/validation.pipe";
import * as compression from 'compression';

const {NODE_ENV, HOST, PORT} = process.env;
const isPro = NODE_ENV === 'production'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // cors
  app.enableCors();

  // 全局校验
  app.useGlobalPipes(new ValidationPipe())

  // 文档
  // if (!isPro) {
    const options = new DocumentBuilder()
        .addBearerAuth() // 开启 BearerAuth 授权认证
        .setTitle('接口文档')
        .setDescription('document API description')
        .setVersion('1.0')
        .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);
  // }

  // 压缩
  app.use(compression());

  await app.listen(PORT, HOST);

  console.log(`Application is running on: http://local.leroy.net.cn:${PORT}`);
}

bootstrap();
