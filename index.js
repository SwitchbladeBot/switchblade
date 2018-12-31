// Initiliaze functions
require('moment')
require('moment-duration-format')

// Initiliaze Canvas
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

const Switchblade = require('./src/Switchblade.js')
const client = new Switchblade(CLIENT_OPTIONS)
client.login().then(() => client.log('[32mLogged in successfully!', 'Discord')).catch(e => client.logError(e))
