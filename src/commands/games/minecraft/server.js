/* eslint-disable no-useless-escape */
const { Command, CommandError, SwitchbladeEmbed } = require('../../../')

const { Attachment } = require('discord.js')
const snekfetch = require('snekfetch')

module.exports = class MinecraftServer extends Command {
  constructor (client) {
    super(client, {
      name: 'server',
      aliases: ['sv'],
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
      channel.send(
        new SwitchbladeEmbed(author)
          .setAuthor(t('commands:minecraft.subcommands.server.server'), this.parentCommand.MINECRAFT_LOGO)
          .setDescription(body.motd.replace(/§[0-9a-fk-or]/g, ''))
          .addField(t('commands:minecraft.subcommands.server.status'), body.online ? t('commands:minecraft.subcommands.server.online') : t('commands:minecraft.subcommands.server.offline'), true)
          .addField(t('commands:minecraft.subcommands.server.address'), `\`${host}:${port}\``, true)
          .addField(t('commands:minecraft.subcommands.server.players'), `${body.players.now}/${body.players.max}`, true)
          .addField(t('commands:minecraft.subcommands.server.version'), body.server.name, true)
          .attachFile(new Attachment(this.decodeBase64Image(body.favicon), 'favIcon.png'))
          .setThumbnail('attachment://favIcon.png')
      ).then(channel.stopTyping())
    } else {
      channel.stopTyping()
      throw new CommandError(t('commands:minecraft.subcommands.server.unknownServer'))
    }
  }

  decodeBase64Image (str) {
    const matches = str.match(/^data:([A-Za-z-+\/]+);base64,([\s\S]+)/)
    if (!matches || matches.length !== 3) return Buffer.from(str, 'base64')
    return Buffer.from(matches[2], 'base64')
  }
}
