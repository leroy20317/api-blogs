module.exports = (app, plugin, model) => {
  const express = require('express');
  const router = express.Router();

  let {Envelope} = model
  let {getPage, requestResult} = plugin

  // 获取列表
  router.get('/envelope', async (req, res) => {
    const p = req.query.page || 1;
    const s = req.query.count || 10;

    try {
      const data = await getPage(Envelope, p, s)
      res.send(requestResult(data, 'success'))
    }catch (e) {
      res.send(requestResult(e, 'error'))
    }
  })

  // 发布
  router.post('/envelope', async (req, res) => {

    try {
      const data = await Envelope.create(req.body)
      res.send(requestResult(data, 'success', '发布成功！'))
    }catch (e) {
      res.send(requestResult(e, 'error'))
    }
  })

  // 更新
  router.post('/envelope/:id', async (req, res) => {
    try {
      const data = await Envelope.findByIdAndUpdate(
          req.params.id,
          req.body,
          (err, doc) => {
            return doc
          })
      res.send(requestResult(data, 'success', '更新成功！'))
    }catch (e) {
      res.send(requestResult(e, 'error'))
    }
  })

  // 获取详情
  router.get('/envelope/:id', async (req, res) => {
    try {
      const data = await Envelope.findById(req.params.id, req.body)
      res.send(requestResult(data, 'success'))
    }catch (e) {
      res.send(requestResult(e, 'error'))
    }
  })

  // 删除
  router.delete('/envelope/:id', async (req, res) => {
    try {
      const data = await Envelope.findByIdAndDelete(req.params.id, req.body)
      res.send(requestResult(data, 'success', '删除成功！'))
    }catch (e) {
      res.send(requestResult(e, 'error'))
    }
  })

  app.use('/admin', router)
}