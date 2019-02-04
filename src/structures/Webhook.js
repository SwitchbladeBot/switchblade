/**
 * Base webhook structure
 * @constructor
 * @param {Client} client - discord.js Client
 * @param {Webhook} parentWebhook - parent webhook to inherit path
 */
module.exports = class Webhook {
  constructor (client, parentWebhook) {
    this.client = client

    this.name = 'WebhookName'

    this.subWebhooks = null
    this.requirements = null
    this.parentWebhook = parentWebhook
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
