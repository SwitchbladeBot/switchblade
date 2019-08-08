const { Schema } = require('mongoose')

// Automatic roles
const AutomaticRoles = new Schema({
  id: { type: String, required: true },
  onlyBots: { type: Boolean, required: true }
})

module.exports = new Schema({
  _id: String,
  prefix: String,
  language: String,
  joinLock: Boolean,
  joinLockMessage: String,
  automaticRoles: [ AutomaticRoles ]
})
