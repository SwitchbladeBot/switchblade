  const { Schema } = require('mongoose')

  module.exports = {
    // User Schema
    User: new Schema({
      _id: String,
      money: { type: Number, default: 0 },
      lastDaily: { type: Number, default: 0 },
      globalXp: { type: Number, default: 0 },
      personalText: { type: String, default: ':)' },
      fortnitePlatform: { type: String },
      epicGamesNickname: { type: String }
    }),

    // Guild Schema
    Guild: new Schema({
      _id: String,
      prefix: { type: String, default: process.env.PREFIX },
      language: { type: String, default: 'en-US' }
    })
  }
