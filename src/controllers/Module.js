const { Controller } = require('../')

// Module
module.exports = class ModuleController extends Controller {
  constructor (client) {
    super('module', client)
  }

  canLoad () {
    return !!this.client.database
  }

  get _guilds () {
    return this.client.database.guilds
  }

  async fetch (_guild, _module) {
    const { modules } = await this._guilds.findOne(_guild, `modules.${_module.name}`)
    return modules[_module.name]
  }

  async toggle (_guild, _module, state) {
    await this._guilds.update(_guild, { [`modules.${_module.name}.enabled`]: state } )
  }

  async updateFields (_guild, _module, entity) {
    await _module.entityVerification(entity)
    await this._guilds.update(_guild, { [`modules.${_module.name}.fields`]: entity } )
  }
}
