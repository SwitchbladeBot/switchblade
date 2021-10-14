const { Loader, Route, Webhook, FileUtils } = require('../')

const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

module.exports = class HTTPLoader extends Loader {
  constructor (client) {
    super({}, client)

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
      this.client.logger.error(e)
    }
    return false
  }

  initializeHTTPServer (port = process.env.PORT) {
    if (!port) return this.client.logger.warn({ tag: 'HTTP' }, 'Server not started - Required environment variable "PORT" is not set.')
    if (!this.client.shard.ids.includes(0)) return this.client.logger.info({ tag: 'HTTP' }, 'Server not started - Client doesn\'t manage shard 0')

    this.app = express()
    // Use CORS with Express
    this.app.use(cors())
    // Parse JSON body
    this.app.use(express.json())
    // Morgan - Request logger middleware
    this.app.use(morgan(':method :url - IP :remote-addr - Code :status - Size :res[content-length] B - Handled in :response-time ms'))

    this.app.listen(port, () => {
      this.client.logger.info({ tag: 'HTTP' }, `Listening on port ${port}`, { tag: 'HTTP' })
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
    }, (e) => this.client.logger.error(e)).then(() => {
      if (failed) this.client.logger.info({ tag: 'HTTP' }, `${success} HTTP routes loaded, ${failed} failed.`)
      else this.client.logger.info({ tag: 'HTTP' }, `All ${success} HTTP routes loaded without errors.`)
    })
  }

  /**
   * Adds a new route to the HTTP server
   * @param {Route} route - Route to be added
   */
  addRoute (route) {
    if (!(route instanceof Route)) {
      this.client.logger.warn({ tag: 'HTTP' }, `${route} failed to load - Not a Route`)
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
    }, (e) => this.client.logger.error(e)).then(() => {
      if (failed === 0) {
        this.client.logger.info({ tag: 'HTTP' }, `All ${success} webhooks loaded without errors.`)
      } else {
        this.client.logger.info({ tag: 'HTTP' }, `${success} webhooks loaded, ${failed} failed.`)
      }
    })
  }

  /**
   * Adds a new webhook to the HTTP server
   * @param {Webhook} webhook - Webhook to be added
   */
  addWebhook (webhook) {
    if (!(webhook instanceof Webhook)) {
      this.client.logger.warn({ tag: 'HTTP' }, `${webhook} failed to load - Not a Webhook`)
      return false
    }

    webhook._register(this.app)
    this.httpWebhooks.push(webhook)
    return true
  }
}
