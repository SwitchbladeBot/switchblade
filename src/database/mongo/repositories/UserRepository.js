const MongoRepository = require('../MongoRepository.js')
const UserSchema = require('../schemas/UserSchema.js')

module.exports = class UserRepository extends MongoRepository {
  constructor (mongoose) {
    super(mongoose, mongoose.model('User', UserSchema))
  }

  parse (entity) {
    return {
      money: 0,
      lastDaily: 0,
      lastRep: 0,
      lastDBLBonusClaim: 0,
      rep: 0,
      globalXp: 0,
      personalText: 'Did you know you can edit this in the future dashboard or using the personaltext command? :o',
      favColor: process.env.EMBED_COLOR,
      connections: [],
      ...(super.parse(entity) || {})
    }
  }
}
