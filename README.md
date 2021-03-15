# api-blogs

## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:5002
$ npm run dev

# build for production and launch server
$ npm run build 
$ and
$ nom run start
```

## Description

1. nest.js+mongoDB
2. 提供前台页面
   1) 文章、短语个人介绍的展示接口
   2) 评论、点赞等交互功能接口
3. 提供后台页面
   1) 文章、短语、评论、个人介绍及系统相关设置的增删改查功能
   2) 登录及通过jwt校验用户登录态
   3) 上传(服务器或七牛)
   4) 备份，每七天将MongoDB数据自动备份并上传至七牛
4. 运用swagger来编写接口文档 
5. 通过.env文件配置不同环境中的相关参数
6. 通过pm2来守护进程
7. 使用jenkins来实现项目的自动化部署