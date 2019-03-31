/**
 * Base route structure
 * @constructor
 * @param {Client} client - discord.js Client
 * @param {Route} parentRoute - parent route to inherit path
 */
module.exports = class Route {
  constructor (client, parentRoute) {
    this.client = client

    this.name = 'RouteName'

    this.subRoutes = null
    this.requirements = null
    this.parentRoute = parentRoute
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
