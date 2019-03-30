const { Command, CommandError, SwitchbladeEmbed } = require('../../../')

const moment = require('moment')
const snekfetch = require('snekfetch')

module.exports = class MinecraftServer extends Command {
  constructor (client) {
    super(client, {
      name: 'skin',
      aliases: ['minecraftskin', 'mskin'],
      parentCommand: 'minecraft',
      parameters: [{
        type: 'string',
        missingError: 'commands:minecraft.subcommands.skin.noName'
      }]
    })
  }

  async run ({ t, author, channel, language }, name) {
    channel.startTyping()
    const { body } = await snekfetch.get(`https://api.mojang.com/users/profiles/minecraft/${name}?at=${moment().format('x')}`)

    if (body && body.id) {
      channel.send(
        new SwitchbladeEmbed(author)
          .setImage(`https://visage.surgeplay.com/full/512/${body.id}.png`)
          .setTitle('NameMC profile (click here)')
          .setURL(`https://namemc.com/profile/${body.id}`)
          .setAuthor(`${name}'s Skin!`, `https://visage.surgeplay.com/head/312/${body.id}.png`)
      ).then(channel.stopTyping())
    } else {
      channel.stopTyping()
      throw new CommandError(t('commands:minecraft.subcommands.skin.unknownName'))
    }
  }
}
