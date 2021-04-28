const { Loader, Route, Webhook, FileUtils } = require('../')
const chalk = require('chalk')

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
      this.logError(e)
    }
    return false
  }

  initializeHTTPServer (port = process.env.PORT) {
    if (!port) return this.log('Server not started - Required environment variable "PORT" is not set.', { color: 'red', tags: ['HTTP'] })
    if (!this.client.shard.ids.includes(0)) return this.log('Server not started - Client doesn\'t manage shard 0', { color: 'red', tags: ['HTTP'] })

    this.app = express()
    // Use CORS with Express
    this.app.use(cors())
    // Parse JSON body
    this.app.use(express.json())
    // Morgan - Request logger middleware
    this.app.use(morgan(`${chalk.cyan('[HTTP]')} ${chalk.green(':method :url - IP :remote-addr - Code :status - Size :res[content-length] B - Handled in :response-time ms')}`))

    this.app.listen(port, () => {
      this.log(`Listening on port ${port}`, { color: 'green', tags: ['HTTP'] })
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
      if (failed) this.log(`${success} HTTP routes loaded, ${failed} failed.`, { color: 'yellow', tags: ['HTTP'] })
      else this.log(`All ${success} HTTP routes loaded without errors.`, { color: 'green', tags: ['HTTP'] })
    })
  }

  /**
   * Adds a new route to the HTTP server
   * @param {Route} route - Route to be added
   */
  addRoute (route) {
    if (!(route instanceof Route)) {
      this.log(`${route} failed to load - Not a Route`, { color: 'red', tags: ['HTTP'] })
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
        this.log(`All ${success} webhooks loaded without errors.`, { color: 'green', tags: ['HTTP'] })
      } else {
        this.log(`${success} webhooks loaded, ${failed} failed.`, { color: 'red', tags: ['HTTP'] })
      }
    })
  }

  /**
   * Adds a new webhook to the HTTP server
   * @param {Webhook} webhook - Webhook to be added
   */
  addWebhook (webhook) {
    if (!(webhook instanceof Webhook)) {
      this.log(`${webhook} failed to load - Not a Webhook`, { color: 'red', tags: ['HTTP'] })
      return false
    }

    webhook._register(this.app)
    this.httpWebhooks.push(webhook)
    return true
  }
}
