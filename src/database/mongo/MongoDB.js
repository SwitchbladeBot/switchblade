const DBWrapper = require('../DBWrapper.js')
const Discord = require('discord.js')

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

  async getUser (_id) {
    if (_id instanceof Discord.User || _id instanceof Discord.GuildMember) _id = _id.id
    if (!_id || typeof _id !== 'string') return

    const User = this.Models.User
    const user = await User.findById(_id).then() || await new User({_id}).save()
    return user
  }

  async getGuild (_id) {
    if (_id instanceof Discord.Guild) _id = _id.id
    if (!_id || typeof _id !== 'string') return

    const Guild = this.Models.Guild
    const guild = await Guild.findById(_id).then() || await new Guild({_id}).save()
    return guild
  }
}
