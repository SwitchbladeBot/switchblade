const DBWrapper = require('../DBWrapper.js')
const { User, Guild } = require('./Schemas.js')
const MongoRepository = require('./MongoRepository.js')

const mongoose = require('mongoose')

module.exports = class MongoDB extends DBWrapper {
  constructor (options = {}) {
    super(options)
    this.mongoose = mongoose
    this.URI = process.env.MONGODB_URI
  }

  connect () {
    return mongoose.connect(this.URI, this.options).then((m) => {
      this.users = new MongoRepository(m, m.model('User', User))
      this.guilds = new MongoRepository(m, m.model('Guild', Guild))
    })
  }
}
