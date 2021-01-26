module.exports = (app, plugin, model) => {
  const express = require('express');
  const router = express.Router();

  let {Counter, Article} = model
  let {getPage, requestResult} = plugin

  // 获取文章
  router.get('/article', async (req, res) => {
    const p = req.query.page || 1;
    const s = req.query.count || 10;

    const data = await getPage(Article, p, s)
    res.send(requestResult(data))
  })

  // 获取指定id文章
  router.get('/article/:_id', async (req, res) => {
    const data = await Article.findById(req.params._id)
    res.send(requestResult(data))
  })

  // 发布文章
  router.post('/article', async (req, res) => {
    /**
     * 获取计数器,每次自增11
     */
    const articleId = await Counter.findOneAndUpdate({
      name: 'articleId'
    }, {
      $inc: {'count': 1}
    }, {
      new: true
    })

    /**
     * 发布新文章
     */
    let result = null;
    if (articleId) {
      // 自定义id
      req.body.id = articleId.count;
      result = await Article.create(req.body)
    } else {
      /**
       * 第一次发表文章
       * 创建自增id字段
       */
      const data = {
        name: 'articleId',
        count: 10001
      }
      const count = await Counter.create(data)
      req.body.id = count.count;
      result = await Article.create(req.body)
    }
    res.send(requestResult(result, '发布成功'))

  })

  // 更新文章
  router.post('/article/:_id', async (req, res) => {
    const data = await Article.findByIdAndUpdate(
        req.params._id,
        req.body,
        (err, doc) => {
          return doc
        })
    res.send(requestResult(data, '更新成功'))
  })

  // 删除文章
  router.delete('/article/:_id', async (req, res) => {
    const data = await Article.findByIdAndDelete(req.params._id, req.body)
    res.send(requestResult(data, '删除成功'))
  })

  app.use('/admin', router)
}