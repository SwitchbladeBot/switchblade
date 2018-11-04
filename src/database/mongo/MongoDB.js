const DBWrapper = require('../DBWrapper.js')
const { User, Guild } = require('./Schemas.js')
const MongoRepository = require('./MongoRepository.js')

const mongoose = require('mongoose')

module.exports = class MongoDB extends DBWrapper {
  constructor (options = {}) {
    super(options)
    this.mongoose = mongoose
  }

  async connect () {
    return mongoose.connect(process.env.MONGODB_URI, this.options).then((m) => {
      this.users = new MongoRepository(m, m.model('User', User))
      this.guilds = new MongoRepository(m, m.model('Guild', Guild))
    })
  }
}
