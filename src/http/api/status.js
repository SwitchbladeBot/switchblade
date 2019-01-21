const { Route } = require('../../index')
const { Router } = require('express')

module.exports = class Status extends Route {
  constructor (client) {
    super(client)
    this.name = 'status'
  }

  register (app) {
    const router = Router()

    /**
     * @api {get} /status Status of the API (200 = default)
     * @apiName Status
     * @apiGroup Status
     *
     * @apiSuccess {Object} will appear the 200 code
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {"code": 200, "message": "OK"}
     */
    router.get('/', async (req, res) => {
      res.json({ code: 200, message: 'OK' })
    })

    app.use(this.path, router)
  }
}
