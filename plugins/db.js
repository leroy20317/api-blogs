// 连接数据库
const mongodbUrl = require('../config').mongodb;

module.exports = app => {
  const mongoose = require('mongoose');
  // mongoose.connect('mongodb://root:lx09120317@152.136.170.96:27017/blogstest', {
  mongoose.connect(mongodbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  mongoose.connection.once("open", function () {
    console.log('mongoose success ~ ~')
  })
}