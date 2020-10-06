const { Command, CommandError, SwitchbladeEmbed } = require('../../../')

const moment = require('moment')
const fetch = require('node-fetch')

module.exports = class MinecraftNameHistory extends Command {
  constructor (client) {
    super({
      name: 'namehistory',
      aliases: ['nameh', 'nh'],
      parent: 'minecraft',
      parameters: [{
        type: 'string',
        missingError: 'commands:minecraft.subcommands.namehistory.noName'
      }]
    }, client)
  }

  async run ({ t, author, channel, language }, name) {
    channel.startTyping()
    moment.locale(language)
    try {
      const findPlayer = await this.nameToUUID(name) || await this.uuidToName(name)

      if (findPlayer.uuid) {
        const nameHistory = await fetch(`https://api.mojang.com/user/profiles/${findPlayer.uuid}/names`).then(res => res.json())
        channel.send(
          new SwitchbladeEmbed(author)
            .setDescription(nameHistory.map(n => `\`${n.name}\` (${n.changedToAt ? moment(n.changedToAt).fromNow() : t('commands:minecraft.subcommands.namehistory.originalname')})`).join('\n'))
            .setTitle(t('commands:minecraft.namemcprofile'))
            .setURL(`https://namemc.com/profile/${findPlayer.uuid}`)
            .setAuthor(t('commands:minecraft.subcommands.namehistory.title', { name: findPlayer.name }), `https://visage.surgeplay.com/head/512/${findPlayer.uuid}.png`)
        ).then(channel.stopTyping())
      } else {
        channel.stopTyping()
        throw new CommandError(t('commands:minecraft.subcommands.namehistory.unknownName'))
      }
    } catch (e) {
      channel.stopTyping()
      throw new CommandError(t('errors:generic'))
    }
  }

  async nameToUUID (name) {
    const body = await fetch(`https://api.mojang.com/users/profiles/minecraft/${name}?at=${moment().format('x')}`).then(res => res.json())
    if (body.id) return { uuid: body.id, name: body.name }
    return false
  }

  async uuidToName (uuid) {
    const { body } = await fetch(`https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`).then(res => res.json())
    if (body.id) return { uuid: body.id, name: body.name }
    return false
  }
}
