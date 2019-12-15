const { Command, CommandError, SwitchbladeEmbed } = require('../../../')

const moment = require('moment')
const fetch = require('node-fetch')

module.exports = class MinecraftSkin extends Command {
  constructor (client) {
    super({
      name: 'skin',
      aliases: ['minecraftskin', 'mskin', 's'],
      parent: 'minecraft',
      parameters: [{
        type: 'string',
        missingError: 'commands:minecraft.subcommands.skin.noName'
      }]
    }, client)
  }

  async run ({ t, author, channel, language }, name) {
    channel.startTyping()
    const findPlayer = await this.nameToUUID(name) || await this.uuidToName(name)

    if (findPlayer.uuid) {
      channel.send(
        new SwitchbladeEmbed(author)
          .setImage(`https://visage.surgeplay.com/full/512/${findPlayer.uuid}.png`)
          .setTitle(t('commands:minecraft.namemcprofile'))
          .setURL(`https://namemc.com/profile/${findPlayer.uuid}`)
          .setAuthor(t('commands:minecraft.subcommands.skin.title', { name: findPlayer.name }), `https://visage.surgeplay.com/head/512/${findPlayer.uuid}.png`)
      ).then(channel.stopTyping())
    } else {
      channel.stopTyping()
      throw new CommandError(t('commands:minecraft.subcommands.skin.unknownName'))
    }
  }

  async nameToUUID (name) {
    const body = await fetch(`https://api.mojang.com/users/profiles/minecraft/${name}?at=${moment().format('x')}`).then(res => res.json())
    if (body.id) return { uuid: body.id, name: body.name }
    return false
  }

  async uuidToName (uuid) {
    const body = await fetch(`https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`).then(res => res.json())
    if (body.id) return { uuid: body.id, name: body.name }
    return false
  }
}
