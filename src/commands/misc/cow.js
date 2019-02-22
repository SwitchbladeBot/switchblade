const { Command } = require('../../')
const cows = require('cows')

module.exports = class Cow extends Command {
  constructor (client) {
    super(client, { name: 'cow' })
  }

  run ({ channel }) {
    const cowNumber = Math.round((Math.random() * cows().length))
    const cow = cows()[cowNumber]
    channel.send(`\`\`\`${cow}\`\`\``)
  }
}
