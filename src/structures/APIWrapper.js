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
    return true
  }

  /**
   * Loads the API
   * @returns {Object} - The loaded API
   */
  load () {
    return this
  }
}
