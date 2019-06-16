// Initialize functions
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

if (process.env.NODE_ENV !== 'production') console.log(readFileSync('bigtitle.txt', 'utf8').toString())

const Switchblade = require('./src/Switchblade.js')
const client = new Switchblade(CLIENT_OPTIONS)

client.login().then(() => client.logger.info(`Logged in successfully as ${client.user.tag}`, { label: 'Login' })).catch(e => client.logger.error(e, { label: 'Login' }))

process.on('unhandledRejection', e => client.logger.error(e, { label: 'UnhandledRejection' }))
process.on('unhandledException', e => client.logger.error(e, { label: 'UnhandledException' }))
