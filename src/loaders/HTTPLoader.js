const { Loader, Route, Webhook, FileUtils } = require('../')

const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

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
      this.logError(e)
    }
    return false
  }

  initializeHTTPServer (port = process.env.PORT) {
    if (!port) return this.log(`[31mHTTP server not started - Required environment variable "PORT" is not set.`, 'HTTP')

    this.app = express()
    // Use CORS with Express
    this.app.use(cors())
    // Parse JSON body
    this.app.use(express.json())
    // Morgan - Request logger middleware
    this.app.use(morgan('[36m[HTTP][0m [32m:method :url - IP :remote-addr - Code :status - Size :res[content-length] B - Handled in :response-time ms[0m'))

    this.app.listen(port, () => {
      this.log(`[32mListening on port ${port}`, 'HTTP')
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
    }, this.logError.bind(this)).then(() => {
      if (failed === 0) {
        this.log(`[32mAll ${success} HTTP routes loaded without errors.`, 'HTTP')
      } else {
        this.log(`[33m${success} HTTP routes loaded, ${failed} failed.`, 'HTTP')
      }
    })
  }

  /**
   * Adds a new route to the HTTP server
   * @param {Route} route - Route to be added
   */
  addRoute (route) {
    if (!(route instanceof Route)) {
      this.log(`[31m${route} failed to load - Not a Route`, 'HTTP')
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
    }, this.logError.bind(this)).then(() => {
      if (failed === 0) {
        this.log(`[32mAll ${success} webhooks loaded without errors.`, 'HTTP')
      } else {
        this.log(`[33m${success} webhooks loaded, ${failed} failed.`, 'HTTP')
      }
    })
  }

  /**
   * Adds a new webhook to the HTTP server
   * @param {Webhook} webhook - Webhook to be added
   */
  addWebhook (webhook) {
    if (!(webhook instanceof Webhook)) {
      this.log(`[31m${webhook} failed to load - Not a Webhook`, 'HTTP')
      return false
    }

    webhook._register(this.app)
    this.httpWebhooks.push(webhook)
    return true
  }
}
