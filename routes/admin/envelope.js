module.exports = (app, plugin, model) => {
  const express = require('express');
  const router = express.Router();

  let {Envelope} = model
  let {getPage, requestResult} = plugin

  // 获取列表
  router.get('/envelope', async (req, res) => {
    const p = req.query.page || 1;
    const s = req.query.count || 10;

    const data = await getPage(Envelope, p, s)
    res.send(requestResult(data))
  })

  // 发布
  router.post('/envelope', async (req, res) => {
    const data = await Envelope.create(req.body)
    res.send(requestResult(data, '发布成功'))
  })

  // 更新
  router.post('/envelope/:id', async (req, res) => {
    const data = await Envelope.findByIdAndUpdate(
        req.params.id,
        req.body,
        (err, doc) => {
          return doc
        })
    res.send(requestResult(data, '更新成功'))
  })

  // 获取详情
  router.get('/envelope/:id', async (req, res) => {
    const data = await Envelope.findById(req.params.id, req.body)
    res.send(requestResult(data))
  })

  // 删除
  router.delete('/envelope/:id', async (req, res) => {
    const data = await Envelope.findByIdAndDelete(req.params.id, req.body)
    res.send(requestResult(data, '删除成功'))
  })

  app.use('/admin', router)
}