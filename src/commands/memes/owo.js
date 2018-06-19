const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../')
const { Command, CommandParameters, StringParameter } = CommandStructures

const snekfetch = require('snekfetch')
const OWOapi = 'https://nekos.life/api/v2/owoify?text='

module.exports = class OwO extends Command {
  constructor (client) {
    super(client)
    this.name = 'owo'
    this.aliases = ['uwu', 'whatsthis', 'owoify']

    this.parameters = new CommandParameters(this,
      new StringParameter({full: true, missingError: 'commands:owo.missingSentence'})
    )
  }

  async run ({ t, author, channel }, text) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    const { body } = await snekfetch.get(OWOapi + encodeURIComponent(text))
    if (body.msg) {
      embed.setColor(Constants.ERROR_COLOR)
        .setTitle(t('commands:owo.tooLongTitle'))
        .setDescription(t('commands:owo.tooLongDescription'))
    } else embed.setTitle(body.owo)
    channel.send(embed).then(() => channel.stopTyping())
  }
}
