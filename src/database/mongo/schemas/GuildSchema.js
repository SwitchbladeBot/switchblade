const { Schema } = require('mongoose')

module.exports = new Schema({
  _id: String,
  prefix: String,
  language: String,
  modules: Object
})
