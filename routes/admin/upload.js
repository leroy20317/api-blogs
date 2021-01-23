const isDev = process.env.SERVER === 'dev';
const typeList = [
    {label: '服务器', value: '1'},
    {label: '七牛KODO', value: '2'},
    {label: '阿里云OSS', value: '3'},
  ]
module.exports = (app, plugin, model) => {
  const express = require('express');
  const router = express.Router();

  let {Info} = model

  const fs = require('fs');
  const co = require('co');

  const multer = require('multer')

  /**
   * 指定文件名和路径
   */
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const name = file.mimetype.includes('image') ? 'image' : 'music';
      cb(null, `${isDev ? './uploads' : '/wwwroot/static/uploads'}/${name}`)
    },
    filename: (req, file, cb) => {
      const temp = file.originalname.split('.');
      const lastName = '.' + temp.pop();
      const fileName = Date.now() + lastName;
      cb(null, fileName)
    }
  })

  const upload = multer({storage})

  // 上传文件
  router.post('/upload', upload.single('file'), async (req, res, next) => {

    //  本地
    //   {
    //   fieldname: 'file',
    //   originalname: '1609830048770.png',
    //   encoding: '7bit',
    //   mimetype: 'image/png',
    //   destination: './uploads/image',
    //   filename: '1610781175559.png',
    //   path: 'uploads/image/1610781175559.png',
    //   size: 42371
    // }

    // 服务器
    //   fieldname: 'file',
    //   originalname: '1609837184452.png',
    //   encoding: '7bit',
    //   mimetype: 'image/png',
    //   destination: '/wwwroot/static/uploads/image',
    //   filename: '1610074208538.png',
    //   path: '/wwwroot/static/uploads/image/1610074208538.png',
    //   size: 295056


    if (req.body.type === '3') {

      /**
       * 阿里云OSS
       */

      let oss = {};
      /**
       * 获取oss
       */
      if (req.body.upload_oss) {
        oss = JSON.parse(req.body.upload_oss)
      } else {
        const result = await Info.find()
        oss = result[0].upload_oss
      }

      //  文件路径
      const localFile = `./${req.file.path}`;
      const filename = req.file.mimetype.includes('image') ? 'image' : 'music';
      const key = `Mood/${filename}/${req.file.filename}`;

      if (Object.keys(oss).length < 5) {
        fs.unlinkSync(localFile);
        res.json({
          status: 'error',
          message: '请填写正确的OSS'
        });
        return;
      }

      const OSS = require('ali-oss');
      const client = new OSS({
        region: oss.region,//填写你开通的oss
        accessKeyId: oss.accessKeyId,
        accessKeySecret: oss.accessKeySecret
      });
      const ali_oss = {
        bucket: oss.bucket,  // bucket name
        endPoint: oss.endPoint, // oss地址
      }

      // 阿里云 上传文件
      co(function* () {
        client.useBucket(ali_oss.bucket);
        const result = yield client.put(key, localFile);

        // 自定义使用域名访问图片，（别忘记把域名解析至oss）
        const url = oss.domain ? `${oss.domain}/${result.name}` : result.url;

        fs.unlinkSync(localFile);   // 上传之后删除本地文件
        res.json({
          status: 'success',
          message: '上传成功',
          body: {
            url: url,
            filename: req.file.filename
          }
        });
      }).catch(function (err) {
        fs.unlinkSync(localFile);
        res.json({
          status: 'error',
          message: '上传失败',
          error: JSON.stringify(err)
        });
      });
    } else if (req.body.type === '2'){
      // 七牛
      const qiniu = require('qiniu')

      //  文件路径
      const localFile = isDev ? `./${req.file.path}` : req.file.path;
      const filename = req.file.mimetype.includes('image') ? 'image' : 'music';
      const key = `uploads/${filename}/${req.file.filename}`;

      const accessKey = 'yH-26a9NAohR_QegJR1uGU5I5Dw595l6n_tXHwPB';
      const secretKey = 'EcLCXW7hZiaY48qbFP1yU9okc17a12mmQqF9Ipth';

      const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
      const config = new qiniu.conf.Config();
      config.zone = qiniu.zone.Zone_z2; // 华南

      const options = { scope: 'leroy20317', expires: 7200 };
      const putPolicy = new qiniu.rs.PutPolicy(options);
      const uploadToken = putPolicy.uploadToken(mac);

      const formUploader = new qiniu.form_up.FormUploader(config);
      const putExtra = new qiniu.form_up.PutExtra();

      const upload = function (key, localFile) {
        return new Promise((resolve, reject) => {
          // 文件上传
          formUploader.putFile(
              uploadToken,
              key,
              localFile,
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
      };

      co(function* () {
        try {
          const result = yield upload(key, localFile);

          return result;
        } catch (error) {
          console.log(error);
        }
      }).finally(() => {
        fs.unlinkSync(localFile);   // 上传之后删除本地文件
      }).then(function () {
        console.log(`上传文件至https://cdn.leroy.net.cn/${key}成功`);
        res.json({
          status: 'success',
          message: '上传成功',
          body: {
            url: `https://cdn.leroy.net.cn/${key}`,
            filename: req.file.filename
          }
        });
      }).catch(err => {
        res.json({
          status: 'error',
          message: '上传失败',
          body: JSON.stringify(err)
        });
      });

    } else {
      const filePath = (req.file.path).replace(/\\/g, "\/");
      res.json({
        status: 'success',
        message: '上传成功',
        body: {
          url: isDev ? `/${filePath}` : filePath.replace('/wwwroot/static', ''),
          filename: req.file.filename
        }
      });
    }
  })

  // 删除文件
  router.post('/delete_file', async (req, res, next) => {
    const type = req.body.type;
    const localFile = req.body.url.replace(/^http(s)?:\/\/(static|cdn)\.leroy\.net\.cn\//i, '')
    if (type === '3') {
      /**
       * 阿里云OSS
       */
      const result = await Info.find()
      const oss = result[0].upload_oss

      const OSS = require('ali-oss');
      const client = new OSS({
        region: oss.region,//填写你开通的oss
        accessKeyId: oss.accessKeyId,
        accessKeySecret: oss.accessKeySecret
      });
      const ali_oss = {
        bucket: oss.bucket,  // bucket name
        endPoint: oss.endPoint, // oss地址
      }

      //  文件路径
      const key = localFile.slice(localFile.indexOf('Mood'));

      // 删除文件
      co(function* () {
        client.useBucket(ali_oss.bucket);
        const result = yield client.delete(key);
        res.json({
          status: 'success',
          message: '删除成功'
        });
      })
    } else if (type === '2'){
      // 七牛
      const qiniu = require('qiniu')
      const accessKey = 'yH-26a9NAohR_QegJR1uGU5I5Dw595l6n_tXHwPB';
      const secretKey = 'EcLCXW7hZiaY48qbFP1yU9okc17a12mmQqF9Ipth';

      const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
      const config = new qiniu.conf.Config();
      const bucketManager = new qiniu.rs.BucketManager(mac, config);

      var key = localFile;
      bucketManager.delete("leroy20317", key, function(err, respBody, respInfo) {
        if (err) {
          console.log(err);
          //throw err;
        } else {
          console.log(respInfo);

          res.json({
            status: 'success',
            message: '删除成功'
          });
        }
      });

    } else {
      fs.unlinkSync(isDev ? `./${localFile}` : `/wwwroot/static/${localFile}`);
      res.json({
        status: 'success',
        message: '删除成功'
      });
    }
  })

  app.use('/admin', router)
}