const { Schema } = require('mongoose')

module.exports = {
  // User Schema
  User: new Schema({
    user_id: { type: String, required: true },
    xp: { type: Number, default: 0 }
  }),

  // Guild Schema
  Guild: new Schema({
    guild_id: { type: String, required: true },
    prefix: { type: String, default: process.env.PREFIX }
  })
}
