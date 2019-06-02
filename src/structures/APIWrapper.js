/**
 * Base API Wrapper structure
 * @constructor
 */
module.exports = class APIWrapper {
  /**
   * @param {string} name - Name of API Wrapper
   * @param {string[]} [envVars] - Required Environment Variables
   */
  constructor (options = {}) {
    this.name = options.name
    this.envVars = options.envVars || []
  }

  /**
   * Check if the API can load
   * @returns {boolean} - Whether the API can load
   */
  canLoad () {
    return true
  }

  /**
   * Loads the API
   * @returns {APIWrapper} - The loaded API
   */
  load () {
    return this
  }
}
