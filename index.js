// Initiliaze functions
require('moment')
require('moment-duration-format')
require('./src/utils/CanvasUtils.js').initializeHelpers()

// Initialize client
const CLIENT_OPTIONS = {}

const Switchblade = require('./src/Switchblade.js')
const client = new Switchblade(CLIENT_OPTIONS)
client.login().then(() => client.log('Logged in successfully!', 'Discord')).catch(e => client.logError(e))
