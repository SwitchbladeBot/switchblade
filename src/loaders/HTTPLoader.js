const { Loader, Route, Webhook, FileUtils } = require('../')

const express = require('express')
const cors = require('cors')
const expressWinston = require('express-winston')

module.exports = class HTTPLoader extends Loader {
  constructor (client) {
    super(client)

    this.httpServer = null
    this.httpRoutes = []
    this.httpWebhooks = []
  }

  async load () {
    try {
      await this.initializeHTTPServer()
      this.client.httpServer = this.app
      this.client.httpRoutes = this.httpRoutes
      this.client.httpWebhooks = this.httpWebhooks
      return true
    } catch (e) {
      this.client.logger.error(e, { label: 'HTTP' })
    }
    return false
  }

  initializeHTTPServer (port = process.env.PORT) {
    if (!port) return this.client.logger.warn(`Web server did not start`, { reason: 'Required environment variable "PORT" is not set', label: 'HTTP' })

    this.app = express()
    // Use CORS with Express
    this.app.use(cors())
    // Parse JSON body
    this.app.use(express.json())
    // Log requests to winston
    this.app.use(expressWinston.logger({
      winstonInstance: this.client.logger,
      expressFormat: true,
      meta: true,
      baseMeta: {
        label: 'HTTP'
      }
    }))

    this.app.listen(port, () => {
      this.client.logger.info(`Listening on port ${port}`, { label: 'HTTP' })
    })

    return this.initializeRoutes().then(() => this.initializeWebhooks())
  }

  // Routes

  /**
   * Initializes all routes
   * @param {string} dirPath - Path to the routes directory
   */
  initializeRoutes (dirPath = 'src/http/api') {
    let success = 0
    let failed = 0
    return FileUtils.requireDirectory(dirPath, (NewRoute) => {
      if (Object.getPrototypeOf(NewRoute) !== Route) return
      this.addRoute(new NewRoute(this.client)) ? success++ : failed++
    }, e => {
      this.client.logger.error(e, { label: this.constructor.name })
    }).then(() => {
      if (failed === 0) {
        this.client.logger.info(`All routes loaded without errors.`, { label: this.constructor.name })
      }
    })
  }

  /**
   * Adds a new route to the HTTP server
   * @param {Route} route - Route to be added
   */
  addRoute (route) {
    if (!(route instanceof Route)) {
      this.client.logger.warn(`${route} failed to load`, { reason: 'Not a Route', label: this.constructor.name })
      return false
    }

    route._register(this.app)
    this.httpRoutes.push(route)
    return true
  }

  // Webhooks

  /**
   * Initializes all webhooks
   * @param {string} dirPath - Path to the webhooks directory
   */
  initializeWebhooks (dirPath = 'src/http/webhooks') {
    let success = 0
    let failed = 0
    return FileUtils.requireDirectory(dirPath, (NewWebhook) => {
      if (Object.getPrototypeOf(NewWebhook) !== Webhook) return
      this.addWebhook(new NewWebhook(this.client)) ? success++ : failed++
    }, e => {
      this.client.logger.error(e, { label: this.constructor.name })
    }).then(() => {
      if (!failed) {
        this.client.logger.info(`All webhooks loaded without errors.`, { label: this.constructor.name })
      }
    })
  }

  /**
   * Adds a new webhook to the HTTP server
   * @param {Webhook} webhook - Webhook to be added
   */
  addWebhook (webhook) {
    if (!(webhook instanceof Webhook)) {
      this.client.logger.warn(`${webhook} failed to load`, { reason: 'Not a Webhook', label: this.constructor.name })
      return false
    }

    webhook._register(this.app)
    this.httpWebhooks.push(webhook)
    return true
  }
}
