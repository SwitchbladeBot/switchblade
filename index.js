const Sentry = require('@sentry/node')
Sentry.init({ dsn: process.env.SENTRY_DSN })
const { Intents } = require('discord.js')
const Tracer = require('dd-trace')
Tracer.init()

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
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
  fetchAllMembers: false,
  enableEveryone: false,
  canvasLoaded
}

console.log(readFileSync('bigtitle.txt', 'utf8').toString())

const Switchblade = require('./src/Switchblade.js')
const client = new Switchblade(CLIENT_OPTIONS)

client.on('debug', (...args) => client.logger.debug(...args))
client.on('rateLimit', (...args) => client.logger.info({ tag: 'rateLimit' }, ...args))

client.initialize()
