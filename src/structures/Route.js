const Utils = require('../utils')

module.exports = class Route {
  /**
   * @param {Object} opts
   * @param {string} opts.name
   * @param {Route} [opts.parent]
   * @param {Client} client
   */
  constructor (opts, client) {
    const options = Utils.createOptionHandler('Route', opts)

    this.name = options.required('name')
    this.parentRoute = options.optional('parent')

    this.client = client

    this.subRoutes = null
    this.requirements = null
  }

  get path () {
    return `${this.parentRoute ? '' : '/api'}${this.parentRoute ? this.parentRoute.path : ''}/${this.name}`
  }

  _register (app) {
    if (this.subRoutes) {
      this.subRoutes.forEach(route => {
        route._register(app)
      })
    }

    this.register(app)
  }

  /**
   * Registers express Router with routes information
   */
  register (app) {}
}
