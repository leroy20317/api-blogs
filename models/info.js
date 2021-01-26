const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: String,              // 管理员昵称
  avatar: String,            // 管理员头像
  address: String,           // 网站地址
  web_name: String,          // 网站名
  web_describe: String,   // 网站描述
  web_seo: String,           // 网站关键词

  upload_type: String,       // 文件上传方式

  email: {                   // 邮箱
    name: String,
    mark: String,
    address: String,
  },

  bg_music: {                   // 背景音乐
    mood: String,
    about: String,
    letter: String,
  },

  cover: {                   // 首屏效果
    date: String,
    title: String,
    link: String,
    color: String,
    image: String,
    describe: String,
    icp: String,
  },
})

module.exports = mongoose.model('Info', schema)