module.exports = (app, plugin, model) => {
  const express = require('express');
  const router = express.Router();

  let {Info, Comment, Counter, Article, Envelope} = model
  let {dateFormat, requestResult} = plugin

  router.get('/info', async (req, res) => {
    const result = await Info.findOne()

    /**
     * 个人信息
     */

    res.send(requestResult(result))
  })

  router.get('/dashboard', async (req, res) => {
    /**
     * 文章列表
     * 短语列表
     * 文章总数
     * 评论总数量
     * 评论未读数量
     */
    const result = await Promise.all([
      Article.findOne().sort({time: -1}),
      Article.countDocuments(),
      Comment.countDocuments(),
      Comment.find({status: 1}).countDocuments(),
      Envelope.find().sort({time: -1}).limit(8),
    ])

    const data = {
      article: {
        last: result[0],
        length: result[1]
      },
      comment: {
        length: result[2],
        unread: result[3],
      },
      envelope: result[4],
    }

    /**
     * 个人信息
     */

    res.send(requestResult(data))
  })



  // router.get('/info', async (req, res) => {
  //   const result = await Promise.all([
  //     Info.findOne(),
  //     Article.findOne().sort({time: -1}),
  //     Envelope.find().sort({time: -1}).limit(8),
  //     Article.countDocuments(),
  //     Comment.countDocuments(),
  //     Comment.find({status: 1}).countDocuments()
  //   ])
  //
  //   /**
  //    * 个人信息
  //    * 文章列表
  //    * 短语列表
  //    * 文章总数
  //    * 评论总数量
  //    * 评论未读数量
  //    */
  //   const key = ['info', 'article', 'envelope', 'articleQty', 'commentQty', 'unread']
  //   const data = key.reduce((total, item, index) => {
  //     total[item] = result[index]
  //     return total
  //   }, {})
  //
  //   res.send(requestResult(data))
  // })

  router.post('/info', async (req, res) => {
    if (req.body._id) {
      const result = await Info.findByIdAndUpdate(
          req.body._id,
          req.body,
          (err, doc) => {
            return doc
          })
      res.send(requestResult(result, '更新成功！'))
    } else {
      const result = await Info.create(req.body)
      res.send(requestResult(result, '创建成功！'))
    }
  })

  app.use('/admin', router)
}