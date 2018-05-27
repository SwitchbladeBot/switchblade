const Repository = require('../Repository.js')

const transformProps = require('transform-props')
const castToString = arg => String(arg)

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

  parse (entity) {
    return entity && transformProps(entity, castToString, '_id')
  }

  add (entity) {
    return this.model.create(entity).then(this.parse)
  }

  findOne (id) {
    return this.model.findById(id).then(this.parse)
  }

  findAll () {
    return this.model.find({}).then(e => e.forEach(this.parse))
  }

  get (id) {
    return this.findOne(id).then(e => e || this.add({_id: id}))
  }

  remove (id) {
    return this.model.findByIdAndRemove(id).then(this.parse)
  }
}
