const { Schema } = require('mongoose')

// Misc
const BlacklistedSchema = new Schema({
  reason: { type: String, required: true },
  blacklister: { type: String, required: true }
})

const UserConnection = new Schema({
  name: String,
  tokens: Object,
  config: Object
})

module.exports = new Schema({
  _id: String,
  money: Number,
  lastDaily: Number,
  globalXp: Number,
  personalText: String,
  blacklisted: BlacklistedSchema,
  favColor: String,
  rep: Number,
  lastRep: Number,
  lastDBLBonusClaim: Number,
  connections: [UserConnection]
})
