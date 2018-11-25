/**
 * Base API Wrapper structure
 * @constructor
 */
module.exports = class APIWrapper {
  constructor () {
    this.name = ''
    this.envVars = []
  }

  /**
   * Check if the API can load
   * @returns {boolean} - Whether the API can load
   */
  canLoad () {
    return this.envVars.length ? this.envVars.every(v => process.env[v]) : true
  }

  /**
   * Loads the API
   * @returns {APIWrapper} - The loaded API
   */
  load () {
    return this
  }
}
