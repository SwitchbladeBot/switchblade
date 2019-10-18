/**
 * Base DB Wrapper structure
 * @constructor
 * @param {Object} options - Options for the DB client
 */
class DBWrapper {
  constructor (options = {}) {
    if (this.constructor === DBWrapper) throw new Error('Cannot instantiate abstract class')
    this.options = options
  }

  /**
   * Creates the DB client connection
   */
  connect () {}
}

DBWrapper.envVars = []

module.exports = DBWrapper
