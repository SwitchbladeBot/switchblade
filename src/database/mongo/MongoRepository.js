const Repository = require('../Repository.js')

module.exports = class MongoRepository extends Repository {
  constructor (mongoose, model) {
    super()

    if (!mongoose || !model) throw new Error('Mongoose model cannot be null.')
    this.mongoose = mongoose

    if (typeof model === 'string') {
      this.model = mongoose.model(model)
    } else {
      this.model = model
    }
  }

  add (entity) {
    return this.model.create(entity)
  }

  findOne (id, projection) {
    return this.model.findById(id, projection)
  }

  findAll (projection) {
    return this.model.find({}, projection)
  }

  get (id, projection) {
    return this.findOne(id, projection).then(e => e || this.add({ _id: id }))
  }

  remove (id) {
    return this.model.findByIdAndRemove(id)
  }

  update (id, entity) {
    return this.model.updateOne({ _id: id }, entity)
  }
}
