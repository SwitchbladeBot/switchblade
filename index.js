const CLIENT_OPTIONS = {
  autoReconnect: true
}

const Switchblade = require('./src/Switchblade.js')
const client = new Switchblade(CLIENT_OPTIONS)
client.login()
