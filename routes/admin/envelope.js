module.exports = (app, plugin, model) => {
  const express = require('express');
  const router = express.Router();

  let {Envelope} = model
  let {getPage} = plugin

  router.get('/envelope', async (req, res) => {
    const p = req.query.page || 1;
    const s = req.query.count || 10;

    const data = await getPage(Envelope, p, s)
    res.send(data)
  })

  router.post('/envelope', async (req, res) => {
    const data = await Envelope.create(req.body)
    res.send(data)
  })

  /**
   * edit && get
   */
  router.post('/envelope/:id', async (req, res) => {
    const data = await Envelope.findByIdAndUpdate(req.params.id, req.body)
    res.send(data)
  })

  router.get('/envelope/:id', async (req, res) => {
    const data = await Envelope.findById(req.params.id, req.body)
    res.send(data)
  })

  router.delete('/envelope/:id', async (req, res) => {
    await Envelope.findByIdAndDelete(req.params.id, req.body)
    res.send({
      success: true
    })
  })

  app.use('/admin', router)
}