const _ = require('lodash')
const Utils = require('../utils')

module.exports = class Module {
  /**
   * @param {Object} options
   * @param {string} options.name
   * @param {string} options.displayName
   * @param {boolean} [options.toggleable]
   * @param {boolean} [options.defaultState]
   * @param {Object} [options.defaultValues]
   * @param {string[]} [options.apiMethods]
   * @param {Object|Function} [options.specialInput]
   * @param {Client} client
   */
  constructor (options = {}, client) {
    this.name = options.name
    this.displayName = options.displayName
    this.toggleable = Utils.default(options.toggleable, true)
    this.defaultState = Utils.default(options.defaultState, true)
    this.defaultValues = Utils.default(options.defaultValues, {})
    this.apiMethods = Utils.default(options.apiMethods, [])
    this.specialInput = options.specialInput

    this.client = client
  }

  // Helpers
  get _guilds () {
    return this.client.database.guilds
  }

  buildProjection (fields) {
    return fields.split(' ').map(f => `modules.${this.name}.${f}`).join(' ')
  }

  validateState (state) {
    return this.toggleable ? typeof state !== 'boolean' ? this.defaultState : state : true
  }

  // Retrievers
  isActive (_guild) {
    if (!this.client.database || !this.toggleable) return this.defaultState
    return this._guilds.findOne(_guild, this.buildProjection('active')).then(g => {
      const mod = g.modules.get(this.name)
      return this.toggleable ? mod ? mod.active : this.defaultState : true
    })
  }

  retrieve (_guild, _projection = 'active values') {
    if (!this.client.database) return { active: this.defaultState, values: this.defaultValues }
    return this._guilds.findOne(_guild, this.buildProjection(_projection)).then(g => g.modules.get(this.name))
  }

  retrieveValue (_guild, value) {
    if (!this.client.database) return this.defaultValues[value]
    return this.asJSON(_guild, `values.${value}`).then(r => r.values[value])
  }

  retrieveValues (_guild, values) {
    if (!this.client.database) return this.defaultValues
    return this.asJSON(_guild, values.map(v => `values.${v}`).join(' ')).then(r => r.values)
  }

  async asJSON (_guild, _projection, _user) {
    if (_projection === 'simple') _projection = 'active'

    const mod = await this.retrieve(_guild, _projection)
    return {
      name: this.name,
      displayName: this.displayName || this.name,
      description: this.description,
      active: this.toggleable ? mod ? mod.active : this.defaultState : true,
      toggleable: this.toggleable,
      values: {
        ...this.defaultValues,
        ...(mod && mod.values ? mod.values : {})
      },
      input: typeof this.specialInput === 'function' ? await this.specialInput(_guild, _user) : this.specialInput
    }
  }

  // Validation
  validateValues (entity) {
    return entity
  }

  // Updaters
  updateValues (_guild, values, _user, validate = true) {
    if (!this.client.database) return

    let entity = values
    if (validate) {
      const { error, value } = this.validateValues(values, _guild, _user)
      entity = value
      if (error) throw error
    }

    const pathF = (k) => `modules.${this.name}.values.${k}`
    const dbObj = {}
    Object.entries(entity).forEach(([ k, v ]) => {
      if (_.isEqual(this.defaultValues[k], v)) {
        if (!dbObj['$unset']) dbObj['$unset'] = {}
        dbObj['$unset'][pathF(k)] = ''
      } else {
        if (!dbObj['$set']) dbObj['$set'] = {}
        dbObj['$set'][pathF(k)] = v
      }
    })
    return this._guilds.update(_guild, dbObj)
  }

  updateState (_guild, state, _user) {
    if (!this.client.database || !this.toggleable) return
    return this._guilds.update(_guild, {
      [`modules.${this.name}.active`]: this.validateState(state)
    })
  }
}
