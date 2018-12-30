const { readFileSync } = require('fs')

// Initiliaze functions
require('moment')
require('moment-duration-format')
require('./src/utils/CanvasUtils.js').initializeHelpers()

// Initialize client
const CLIENT_OPTIONS = {
  'fetchAllMembers': true,
  'enableEveryone': false
}

console.log(readFileSync('bigtitle.txt', 'utf8').toString())

const Switchblade = require('./src/Switchblade.js')
const client = new Switchblade(CLIENT_OPTIONS)
client.login().then(() => client.log('[32mLogged in successfully!', 'Discord')).catch(e => client.logError(e))
