const DBWrapper = require('../DBWrapper.js')

const Schemas = require('./Schemas.js')
const mongoose = require('mongoose')

module.exports = class MongoDB extends DBWrapper {
  constructor (options = {}) {
    super(options)
    this.mongoose = mongoose // Debug purpose
    this.URI = process.env.MONGODB_URI
    this.Models = {}
  }

  connect () {
    return mongoose.connect(this.URI, this.options).then(() => {
      Object.keys(Schemas).forEach(k => {
        this.Models[k] = mongoose.model(k, Schemas[k])
      })
    })
  }

  async getModelByIndex (modelName, indexName, indexValue, createFallback = true) {
    const Model = this.Models['modelName']
    const model = await Model.findOne({index: indexValue}).then() || createFallback ? await new Model({index: indexValue}).save() : null
    return model
  }

  async getUser (id) {
    if (!id || typeof id !== 'string') return
    return this.getModelByIndex('User', 'user_id', id)
  }

  async getGuild (id) {
    if (!id || typeof id !== 'string') return
    return this.getModelByIndex('Guild', 'guild_id', id)
  }
}
