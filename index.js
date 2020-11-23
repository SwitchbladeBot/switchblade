const Sentry = require('@sentry/node')
Sentry.init({ dsn: process.env.SENTRY_DSN })

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
  fetchAllMembers: false,
  enableEveryone: false,
  canvasLoaded
}

console.log(readFileSync('bigtitle.txt', 'utf8').toString())

const Switchblade = require('./src/Switchblade.js')
const client = new Switchblade(CLIENT_OPTIONS)

client.on('debug', (...args) => console.log('debug', ...args))
client.on('rateLimit', (...args) => console.log('rateLimit', ...args))

client.initialize()
