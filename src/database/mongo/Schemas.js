const { Schema } = require('mongoose')

module.exports = {
  // User Schema
  User: new Schema({
    _id: String,
    money: { type: Number, default: 0 },
    lastDaily: { type: Number, default: 0 },
    globalXp: { type: Number, default: 0 },
    personalText: { type: String, default: 'Do you know that you can edit this in the future dashboard? :o' },
    blacklisted: {type: Boolean, default: false},
    favColor: { type: String, default: process.env.EMBED_COLOR },
    rep: { type: Number, default: 0 },
    lastRep: { type: Number, default: 0 }
  }),

  // Guild Schema
  Guild: new Schema({
    _id: String,
    prefix: { type: String, default: process.env.PREFIX },
    language: { type: String, default: 'en-US' }
  })
