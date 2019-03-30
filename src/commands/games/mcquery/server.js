const { Command, CommandError, SwitchbladeEmbed } = require('../../../')

const { Attachment } = require('discord.js')
const snekfetch = require('snekfetch')

module.exports = class MinecraftServer extends Command {
  constructor (client) {
    super(client, {
      name: 'server',
      aliases: ['s'],
      parentCommand: 'minecraft',
      parameters: [{
        type: 'string',
        missingError: 'commands:minecraft.subcommands.server.noIP'
      }]
    })
  }

  async run ({ t, author, channel, language }, address) {
    channel.startTyping()
    const [ host, port = 25565 ] = address.split(':')
    const { body } = await snekfetch.get(`https://mcapi.us/server/status?ip=${host}&port=${port}`)

    if (body.online) {
      const imageData = this.decodeBase64Image(body.favicon)
      channel.send(
        new SwitchbladeEmbed(author)
          .setAuthor('Minecraft Server', this.parentCommand.MINECRAFT_LOGO)
          .setDescription(body.motd.replace(/§[0-9a-fk-or]/g, ''))
          .addField('Status', body.online ? 'Online' : 'Offline', true)
          .addField('Address', `\`${host}:${port}\``, true)
          .addField('Players', `${body.players.now}/${body.players.max}`, true)
          .addField('Version', body.server.name, true)
          .attachFile(new Attachment(imageData, 'favIcon.png'))
          .setThumbnail('attachment://favIcon.png')
      ).then(channel.stopTyping())
    } else {
      throw new CommandError(t('commands:minecraft.subcommands.server.unknownServer'))
      channel.stopTyping()
    }
  }

  decodeBase64Image (str) {
    const matches = str.match(/^data:([A-Za-z-+\/]+);base64,([\s\S]+)/)
    if (!matches || matches.length !== 3) return Buffer.from(str, 'base64')
    return Buffer.from(matches[2], 'base64')
  }
}
