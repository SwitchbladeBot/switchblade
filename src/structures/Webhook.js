const Utils = require('../utils')

module.exports = class Webhook {
  /**
   * @param {Object} opts
   * @param {string} opts.name
   * @param {Webhook} [opts.parent]
   * @param {Client} client
   */
  constructor (opts, client) {
    const options = Utils.createOptionHandler('Webhook', opts)

    this.name = options.required('name')
    this.parentWebhook = options.optional('parent')

    this.client = client

    this.subWebhooks = null
    this.requirements = null
  }

  get path () {
    return `${this.parentRoute ? '' : '/webhooks'}${this.parentRoute ? this.parentRoute.path : ''}/${this.name}`
  }

  _register (app) {
    if (this.subWebhooks) {
      this.subWebhooks.forEach(webhook => {
        webhook._register(app)
      })
    }

    this.register(app)
  }

  /**
   * Registers express Router with webhooks information
   */
  register (app) {}
}
