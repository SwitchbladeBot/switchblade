const MongoRepository = require('../MongoRepository.js')
const ReminderSchema = require('../schemas/ReminderSchema.js')

module.exports = class ReminderRepository extends MongoRepository {
  constructor (mongoose) {
    super(mongoose, mongoose.model('Reminder', ReminderSchema))
  }

  parse (entity) {
    return {
      ...(super.parse(entity) || {})
    }
  }
}
