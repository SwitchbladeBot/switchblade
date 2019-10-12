const MongoRepository = require('../MongoRepository.js')
const GuildSchema = require('../schemas/GuildSchema.js')

module.exports = class GuildRepository extends MongoRepository {
  constructor (mongoose) {
    super(mongoose, mongoose.model('Guild', GuildSchema))
  }

  parse (entity) {
    return {
      prefix: process.env.PREFIX,
      language: 'en-US',
      modules: new Map(),
      ...(super.parse(entity) || {})
    }
  }
}
