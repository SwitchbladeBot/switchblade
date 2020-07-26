const Sentry = require('@sentry/node')
Sentry.init({ dsn: process.env.SENTRY_DSN })

require('dotenv').config()

const { readFileSync } = require('fs')

require('moment')
require('moment-duration-format')

// Initialize Canvas
let canvasLoaded = false
try {
  require('canvas')
  require('./src/utils/CanvasUtils.js').initializeHelpers()
  canvasLoaded = true
} catch (e) {}

// Initialize client
const CLIENT_OPTIONS = {
  fetchAllMembers: true,
  enableEveryone: false,
  canvasLoaded
}

console.log(readFileSync('bigtitle.txt', 'utf8').toString())

const Switchblade = require('./src/Switchblade.js')

const shards = JSON.parse(process.env.SHARD_LIST)

shards.forEach(shardId => {
  const client = new Switchblade({ shardId, shardCount: shards.length, ...CLIENT_OPTIONS })
  client.on('debug', (...args) => console.log('debug', ...args))
  client.on('rateLimit', (...args) => console.log('rateLimit', ...args))
  client.initialize()
})
