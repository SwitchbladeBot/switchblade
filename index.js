// Initialize functions
const { readFileSync } = require('fs')

require('moment')
require('moment-duration-format')
const { format } = require('winston')
const os = require('os')

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

client.login().then(() => {
  client.logger.info(`Logged in successfully as ${client.user.tag}`, { label: 'Login' })
  if (process.env.DD_API_KEY) {
    const DatadogTransport = require('@shelf/winston-datadog-logs-transport')
    client.logger.add(new DatadogTransport({
      apiKey: process.env.DD_API_KEY,
      metadata: {
        ddsource: `switchblade-${process.env.NODE_ENV}`,
        service: 'switchblade',
        host: os.hostname(),
        ddtags: `bot-id:${client.user.id}`
      },
      format: format.combine(
        format.errors({ stack: true }),
        format.timestamp()
      ),
      level: 'silly'
    }))
    client.logger.info('Datadog Transport enabled', { label: 'Logger' })
  }
}).catch(e => client.logger.error(e, { label: 'Login' }))

process.on('unhandledRejection', e => client.logger.error(e, { label: 'UnhandledRejection' }))
process.on('unhandledException', e => client.logger.error(e, { label: 'UnhandledException' }))
