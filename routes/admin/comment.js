module.exports = (app, plugin, model) => {
  const express = require('express');
  const router = express.Router();

  let {Comment, Counter, Article} = model
  let {email, getPage, requestResult} = plugin


  // Get comment
  router.get('/comment', async (req, res) => {
    const p = req.query.page || 1;
    const s = req.query.count || 10;

    const data = await getPage(Comment, p, s)
    res.send(requestResult(data))
  })

  // Delete
  router.delete('/comment', async (req, res) => {
    const id = req.body.id;
    const total = [
      new Promise((resolve, reject) => {
        Comment.deleteOne({id}, (err, doc) => doc ? resolve(doc) : reject())
      })
    ]

    // 当前为一级评论则删除所有子评论
    if (!req.body.parent_id) {
      total.push(new Promise((resolve, reject) => {
        Comment.deleteMany({parent_id: id}, (err, doc) => doc ? resolve(doc) : reject())
      }))
    }
    Promise.all(total).then(resolve => {
      res.send(requestResult(resolve[0], '操作成功'))
    }).catch(err => {
      res.send(requestResult())
    })
  })

  // Reply
  router.post('/comment', async (req, res) => {
    const commentCount = await Counter.findOneAndUpdate({
      name: 'comment'
    }, {
      $inc: {'count': 1}
    }, {
      new: true
    })

    // 添加评论id
    req.body.id = commentCount.count;
    const result = await Comment.create(req.body)

    res.send(requestResult(result))

  })

  // 一键已读
  router.post('/comment_read', async (req, res) => {
    const comment = await Comment.updateMany({
      status: 1
    }, {
      $set: {status: 2}
    }, {
      multi: true
    }, (err, doc) => {
      return doc;
    })

    res.send(requestResult(comment, '操作成功!'))
  })
  app.use('/admin', router)
}