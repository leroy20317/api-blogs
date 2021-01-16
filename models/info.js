const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: String,           // 管理员昵称
  avatar: String,         // 管理员头像
  address: String,        // 网站地址
  web_name: String,       // 网站名
  web_describe: String,   // 网站描述
  web_seo: String,        // 网站关键词

  upload_type: String,    // 文件上传方式

  email: {
    name: String,
    mark: String,
    address: String,
  },

  bg: {
    bg_mood: String,
    bg_about: String,
    bg_letter: String,
  },

  cover: {                // 首屏效果
    date: String,
    title: String,
    link: String,
    color: String,
    image: String,
    describe: String,
    icp_txt: String,
    icp_link: String
  },
})

module.exports = mongoose.model('Info', schema)