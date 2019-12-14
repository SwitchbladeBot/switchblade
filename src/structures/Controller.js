const Utils = require('../utils')

module.exports = class Controller {
  /**
   * @param {Object} opts
   * @param {string} opts.name
<<<<<<< HEAD
   * @param {Controller} [opts.parent]
=======
   * @param {string} [opts.parent]
>>>>>>> 379416679aabef85436b699ed012d79d596a2d94
   * @param {Client} client
   */
  constructor (opts, client) {
    const options = Utils.createOptionHandler('Controller', opts)

    this.name = options.required('name')
    this.parentController = options.optional('parent')

    this.client = client

    this.subcontrollers = []
  }

  canLoad () {
    return true
  }

  load () {
    this.subcontrollers.forEach(subcontroller => {
      Object.defineProperty(this, subcontroller.name, { get: () => subcontroller })
    })

    return this
  }
}
