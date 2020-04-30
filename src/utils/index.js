module.exports = {
  /**
   * @param {string} structure
   * @param {Object} structureOptions
   * @param {Object} [options]
   * @param {boolean} [options.optionalOptions]
   */
  createOptionHandler (structureName, structureOptions, options = {}) {
    if (!options.optionalOptions && typeof options === 'undefined') {
      throw new Error(`The options of structure "${structureName}" is required.`)
    }

    return ({
      optional (name, defaultValue = null) {
        const value = structureOptions[name]

        return typeof value === 'undefined'
          ? defaultValue
          : value
      },

      required (name) {
        const value = structureOptions[name]

        if (typeof value === 'undefined') {
          throw new Error(`The option "${name}" of structure "${structureName}" is required.`)
        }
        return value
      }
    })
  }
}
