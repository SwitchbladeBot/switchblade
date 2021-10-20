const MongoRepository = require('../MongoRepository.js')
const RolesSchema = require('../schemas/RolesSchema.js')

module.exports = class RolesRepository extends MongoRepository {
  constructor (mongoose) {
    super(mongoose, mongoose.model('Roles', RolesSchema))
  }

  parse (entity) {
    return {
      giftedRole: '',
      users: [],
      ...(super.parse(entity) || {})
    }
  }

  // update(filter , entity , options = { "upsert": true }) {
  //   return this.model.updateOne(filter, entity, options)
  // }
}
