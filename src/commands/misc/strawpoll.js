const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../')
const { Command, CommandParameters, StringParameter } = CommandStructures
const snekfetch = require('snekfetch')

module.exports = class Strawpoll extends Command {
  constructor (client) {
    super(client)

    this.name = 'strawpoll'
    this.aliases = ['spoll', 'strawp']
    this.parameters = new CommandParameters(this,
      new StringParameter({ full: true, missingError: 'commands:strawpoll.noParameters' })
    )
  }

  async run ({ t, author, channel }, text) {
    const embed = new SwitchbladeEmbed(author)
    const options = text.split('|')
    const title = options.shift()

    if (options.length >= 2 && options.length <= 30) {
      channel.startTyping()
      const strawOptions = {
        headers: {
          'Content-Type': 'application/json'
        },
        data: { title, options }
      }
      const { body } = await snekfetch.post('https://strawpoll.me/api/v2/polls', strawOptions)

      embed
        .setColor(0xffd756)
        .setAuthor(body.title, 'https://i.imgur.com/Dceju2J.jpg')
        .setDescription(body.options.map(o => `**>** ${o}`).join('\n') + `\n\n[${t('commands:strawpoll.clickHere')}](http://strawpoll.me/${body.id})\n\`http://strawpoll.me/${body.id}\``)
    } else {
      embed
        .setColor(Constants.ERROR_COLOR)
        .setTitle(t('commands:strawpoll.optionsNumberError'))
    }

    channel.send(embed).then(() => channel.stopTyping())
  }
}
