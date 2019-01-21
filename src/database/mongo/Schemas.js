const { Schema } = require('mongoose')

module.exports = {
  // User Schema
  User: new Schema({
    _id: String,
    money: { type: Number, default: 0 },
    lastDaily: { type: Number, default: 0 },
    globalXp: { type: Number, default: 0 },
    personalText: { type: String, default: 'Did you know you can edit this in the future dashboard or using the personaltext command? :o' },
    blacklisted: { type: Boolean, default: false },
    blacklistReason: String,
    blacklisterId: String,
    favColor: { type: String, default: process.env.EMBED_COLOR },
    rep: { type: Number, default: 0 },
    lastRep: { type: Number, default: 0 },
    lastDBLBonusClaim: { type: Number, default: 0 }
  }),

  // Guild Schema
  Guild: new Schema({
    _id: String,
    prefix: { type: String, default: process.env.PREFIX },
    language: { type: String, default: 'en-US' },
    joinLock: { type: Boolean, default: false },
    joinLockMessage: String
  }),

  // Background Schema
  Background: new Schema({
    _id: String,
    displayName: { type: String, default: 'Default' },
    description: { type: String, default: 'default background' },
    fullSizeURL: { type: String, default: 'https://i.imgur.com/T0vfmnF.jpg' },
    croppedURL: { type: String, default: 'https://i.imgur.com/F9iKKLT.png' },
    tags: { type: String, default: 'off' },
    disabled: { type: Boolean, default: false },
    hidden: { type: Boolean, default: false },
    purchasable: { type: Boolean, default: true },
    price: { type: Number, default: 0 }
  })
}
