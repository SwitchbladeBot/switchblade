const { Schema } = require('mongoose')

// Misc Schemas
const BlacklistedSchema = new Schema({
  reason: { type: String, required: true },
  blacklister: { type: String, required: true }
})

module.exports = {
  // User Schema
  User: new Schema({
    _id: String,
    money: { type: Number, default: 0 },
    lastDaily: { type: Number, default: 0 },
    globalXp: { type: Number, default: 0 },
    personalText: String,
    blacklisted: BlacklistedSchema,
    favColor: String,
    rep: { type: Number, default: 0 },
    lastRep: { type: Number, default: 0 },
    lastDBLBonusClaim: { type: Number, default: 0 }
  }),

  // Guild Schema
  Guild: new Schema({
    _id: String,
    prefix: String,
    language: String,
    joinLock: Boolean,
    joinLockMessage: String
  })
}
