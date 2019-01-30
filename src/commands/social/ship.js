const { CommandStructures, SwitchbladeEmbed, CanvasTemplates } = require('../../')
const { Command, CommandParameters, UserParameter } = CommandStructures
const { Attachment } = require('discord.js')

module.exports = class Ship extends Command {
  constructor (client) {
    super(client)
    this.name = 'ship'
    this.category = 'social'

    this.parameters = new CommandParameters(this,
      new UserParameter({ required: true, acceptSelf: true, missingError: 'commands:ship.noUser' }),
      new UserParameter({ required: false, acceptSelf: true })
    )
  }

  async run ({ t, author, channel, guild }, first, second) {
    if (!second) {
      second = first
      first = author
    }
    channel.startTyping()

    const { username: firstName } = first
    const { username: secondName } = second

    const shipName = firstName.substr(0, firstName.length * 0.5) + secondName.substr(secondName.length * 0.5)
    const percentCalc = (Number(second.id.slice(-3)) + Number(first.id.slice(-3))) % 100
    const percent = first.equals(second) ? 101 : percentCalc
    const type = percent < 35 ? 'low' : percent > 60 ? 'high' : 'medium'

    const messagesCount = 6
    const messageKeys = { shipName, first, second, percent }
    const result = Math.floor((Math.random() * messagesCount))
    const randomMessage = t(`commands:ship.messages.${type}.${result}`, messageKeys)
    const message = first.equals(second) ? t(`commands:ship.messages.self.${result}`, messageKeys) : randomMessage

    const users = [first, second].map(async user => {
      return {
        tag: user.tag,
        document: await this.client.modules.social.retrieveProfile(user.id),
        profile: user.displayAvatarURL.replace('.gif', '.png')
      }
    })

    const image = await CanvasTemplates.ship(users, shipName, percent)

    const embed = new SwitchbladeEmbed(author)
      .setDescription(message)
      .attachFile(new Attachment(image, 'ship.png'))
      .setImage('attachment://ship.png')

    await channel.send(embed)
    await channel.stopTyping()
  }
}
