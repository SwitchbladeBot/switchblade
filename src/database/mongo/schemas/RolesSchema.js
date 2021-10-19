const { Schema } = require('mongoose')

module.exports = new Schema({
  _id: String,
  giftedRole: {
    type: String,
    default: ''
  },
  users: {
    type: Array,
    default: []
  }
})
