/**
 * Base database Repository structure
 * @constructor
 */
module.exports = class Repository {
  constructor () {
    if (this.constructor === Repository) throw new Error('Cannot instantiate abstract class')
  }

  /**
   * Parses an entity into custom repository response (e.: with a save propertie)
   * @param {Object} entity - Unparsed entity
   * @returns {Object} - Parsed entity
   */
  parse (entity) {}

  /**
   * Saves an entity into the repository
   * @param {Object} entity - Entity to be save
   * @returns {Object} - Added entity
   */
  add (entity) {}

  /**
   * Retrieves an entity from the repository
   * @param {String} id - Entity's id
   * @returns {Object} - Retrieved entity
   */
  findOne (id) {}

  /**
   * Retrieves all entities from the repository
   * @returns {Array<Object>} - Retrieved entities
   */
  findAll () {}

  /**
   * Retrieves an entity from the repository, creates and returns a new one if it doesn't find it
   * @param {String} entity - Entity's id
   * @returns {Object} - Retrieved entity
   */
  get (id) {}

  /**
   * Removes an entity from the repository
   * @param {String} entity - Entity's id
   * @returns {Object} - Removed entity
   */
  remove (id) {}
}
