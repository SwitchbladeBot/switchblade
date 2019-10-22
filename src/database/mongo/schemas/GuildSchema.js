const { Schema } = require('mongoose')

const ModuleSchema = new Schema({
  active: { type: Boolean, required: true },
  values: {}
})

module.exports = new Schema({
  _id: String,
  prefix: String,
  language: String,
  joinLock: Boolean,
  joinLockMessage: String,
  modules: {
    type: Map,
    of: ModuleSchema
  }
})
