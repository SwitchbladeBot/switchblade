const Repository = require('../Repository.js')

const transformProps = require('transform-props')
const castToString = arg => String(arg)

module.exports = class MongoRepository extends Repository {
  constructor (mongoose, model) {
    super()

    if (!mongoose || !model) throw new Error('Mongoose model cannot be null.')
    this.mongoose = mongoose

    this.model = typeof model === 'string' ? mongoose.model(model) : model
  }

  parse (entity) {
    return entity ? transformProps(entity.toObject({ versionKey: false }), castToString, '_id') : null
  }

  add (entity) {
    return this.model.create(entity).then(this.parse)
  }

  findOne (id, projection) {
    return this.model.findById(id, projection).then(this.parse)
  }

  findAll (projection) {
    return this.model.find({}, projection).then(e => e.map(this.parse))
  }

  get (id, projection) {
    return this.findOne(id, projection).then(e => e || this.add({ _id: id }))
  }

  remove (id) {
    return this.model.findByIdAndRemove(id).then(this.parse)
  }

  update (id, entity, options = { upsert: true }) {
    return this.model.updateOne({ _id: id }, entity, options)
  }
}
