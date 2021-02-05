import {NestFactory} from '@nestjs/core';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import {AppModule} from './app.module';
import config from './utils/config'
import {ValidationPipe} from "./pipe/validation.pipe";
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // cors
  app.enableCors();

  // 全局校验
  app.useGlobalPipes(new ValidationPipe())

  // 文档
  if (!config.isPro) {
    const options = new DocumentBuilder()
        .addBearerAuth() // 开启 BearerAuth 授权认证
        .setTitle('接口文档')
        .setDescription('document API description')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('docs', app, document);
  }

  // 压缩
  app.use(compression());

  await app.listen(config.port, config.host);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
