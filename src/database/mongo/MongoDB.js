const DBWrapper = require('../DBWrapper.js')
const { GuildRepository, UserRepository } = require('./repositories')

const mongoose = require('mongoose')

module.exports = class MongoDB extends DBWrapper {
  constructor (options = {}) {
    super(options)
    this.mongoose = mongoose
  }

  async connect () {
    return mongoose.connect(process.env.MONGODB_URI, this.options).then((m) => {
      this.guilds = new GuildRepository(m)
      this.users = new UserRepository(m)
    })
  }
}
