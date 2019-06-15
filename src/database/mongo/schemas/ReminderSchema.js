const { Schema } = require('mongoose')

module.exports = new Schema({
  _id: String,
  userId: String,
  messageId: String,
  channelId: String,
  text: String,
  timestamp: String
})
