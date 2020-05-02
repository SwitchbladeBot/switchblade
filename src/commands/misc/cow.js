const { Command } = require('../../')
const cows = require('cows')

module.exports = class Cow extends Command {
  constructor (client) {
    super({
      name: 'cow'
    }, client)
  }

  run ({ channel }) {
    const cowNumber = Math.round((Math.random() * cows().length))
    const cow = cows()[cowNumber]
    channel.send(`\`\`\`${cow}\`\`\``)
  }
}
