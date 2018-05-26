/**
 * Base DB Wrapper structure
 * @constructor
 * @param {Object} options - Options for the DB client
 */
module.exports = class DBWrapper {
  constructor (options = {}) {
    this.options = options
  }

  /**
   * Creates the DB client connection
   */
  connect () {}

  /**
   * Retrieves an user structure from the DB
   * @param {string|User|GuildMember} _id - User id
   */
  getUser (_id) {}

  /**
   * Retrieves a guild structure from the DB
   * @param {string|Guild} _id - Guild id
   */
  getGuild (_id) {}
}
