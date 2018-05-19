/**
 * Base API Wrapper structure
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
    if (this.envVars.length) {
      return this.envVars.every(v => process.env[v])
    }
    return true
  }

  /**
   * Loads the API
   * @returns {Object} - The loaded API
   */
  load () {}
}
