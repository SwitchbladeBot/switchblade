const { CommandStructures, SwitchbladeEmbed } = require('../../')
const { Command, CommandRequirements } = CommandStructures
const snekfetch = require('snekfetch')

module.exports = class Trap extends Command {
  constructor (client) {
    super(client)
    this.name = 'trap'
    this.aliases = ['nohomo']
    this.category = 'anime'

    this.requirements = new CommandRequirements(this, { nsfwOnly: true })
  }

  async run ({ t, author, channel }) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()

    const { body: { url } } = await snekfetch.get('https://nekos.life/api/v2/img/trap')

    embed.setImage(url)
      .setDescription(t('commands:trap.hereIsYourTrap'))

    channel.send(embed).then(() => channel.stopTyping())
  }
}
