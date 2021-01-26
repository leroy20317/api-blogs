module.exports = (app, plugin, model) => {
  const express = require('express');
  const router = express.Router();

  let {Myself} = model
  let {requestResult} = plugin

  router.post('/myself', async (req, res) => {

    try {
      if (req.body._id) {
        const result = await Myself.findByIdAndUpdate(
            req.body._id,
            req.body,
            (err, doc) => {
              return doc
            })
        res.send(requestResult(result, 'success', '更新成功！'))
      } else {
        const result = await Myself.create(req.body)
        res.send(requestResult(result, 'success', '填写成功！'))
      }
    }catch (e) {
      res.send(requestResult(e, 'error'))
    }
  })

  router.get('/myself', async (req, res) => {
    try {
      const result = await Myself.findOne()
      res.send(requestResult(result, 'success'))
    }catch (e) {
      res.send(requestResult(e, 'error'))
    }
  })

  app.use('/admin', router)
}