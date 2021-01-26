const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  admin: {                   // 管理页面
    name: String,            // 管理员昵称
    avatar: String,          // 管理员头像
    upload_type: String,     // 文件上传方式
  },
  web: {                     // 前台页面
    address: String,         // 网站地址
    name: String,            // 网站名
    description: String,     // 网站描述
    seo: String,             // 网站关键词
    icp: String,             // 备案号
  },
  cover: {                   // 首屏效果
    date: String,
    title: String,
    link: String,
    color: String,
    image: String,
    description: String,
    icp: String,
  },
  bg_music: {                   // 背景音乐
    mood: String,
    about: String,
    letter: String,
  },
  comment: {                   // 评论相关
    email: String,
    mark: String,
    name: String,
  },
})

module.exports = mongoose.model('Info', schema)