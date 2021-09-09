const { Command, SwitchbladeEmbed, CanvasTemplates } = require('../../')
const { MessageAttachment } = require('discord.js')

module.exports = class Ship extends Command {
  constructor (client) {
    super({
      name: 'ship',
      category: 'social',
      requirements: {
        databaseOnly: true,
        canvasOnly: true
      },
      parameters: [{
        type: 'user',
        required: false,
        acceptSelf: true
      }, {
        type: 'user',
        acceptSelf: true,
        missingError: 'commands:ship.noUser'
      }]
    }, client)
  }

  async run ({ t, author, channel, guild }, first = author, second) {
    channel.startTyping()

    const { username: firstName } = first
    const { username: secondName } = second

    const shipName = firstName.substr(0, firstName.length * 0.5) + secondName.substr(secondName.length * 0.5)
    const percentCalc = (Number(second.id.slice(-3)) + Number(first.id.slice(-3))) % 101
    const percent = first.equals(second) ? 101 : percentCalc
    const type = percent < 35 ? 'low' : percent > 70 ? 'high' : 'medium'

    const messagesCount = 6
    const messageKeys = { shipName, firstName, secondName, percent }
    const result = Math.floor((Math.random() * messagesCount))
    const randomMessage = t(`commands:ship.messages.${type}.${result}`, messageKeys)
    const message = first.equals(second) ? t(`commands:ship.messages.self.${result}`, messageKeys) : randomMessage

    const users = [first, second].map(async user => {
      return {
        tag: user.tag,
        document: await this.client.controllers.social.retrieveProfile(user.id),
        profile: user.displayAvatarURL({ format: 'png' })
      }
    })

    const image = await CanvasTemplates.ship(users, shipName, percent)

    const embed = new SwitchbladeEmbed(author)
      .setDescription(message)
      .attachFiles(new MessageAttachment(image, 'ship.png'))
      .setImage('attachment://ship.png')

    await channel.send(embed)
    await channel.stopTyping()
  }
}
