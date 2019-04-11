const { Command, CommandError, SwitchbladeEmbed } = require('../../../')

const moment = require('moment')
const snekfetch = require('snekfetch')

module.exports = class MinecraftNameHistory extends Command {
  constructor (client) {
    super(client, {
      name: 'namehistory',
      aliases: ['nameh', 'nh'],
      parentCommand: 'minecraft',
      parameters: [{
        type: 'string',
        missingError: 'commands:minecraft.subcommands.namehistory.noName'
      }]
    })
  }

  async run ({ t, author, channel, language }, name) {
    channel.startTyping()
    moment.locale(language)
    const findPlayer = await this.nameToUUID(name) || await this.uuidToName(name)

    if (findPlayer.uuid) {
      const nameHistory = await snekfetch.get(`https://api.mojang.com/user/profiles/${findPlayer.uuid}/names`)
      channel.send(
        new SwitchbladeEmbed(author)
          .setDescription(nameHistory.body.map(n => `\`${n.name}\` (${n.changedToAt ? moment(n.changedToAt).fromNow() : t('commands:minecraft.subcommands.namehistory.originalname')})`).join('\n'))
          .setTitle(t('commands:minecraft.namemcprofile'))
          .setURL(`https://namemc.com/profile/${findPlayer.uuid}`)
          .setAuthor(t('commands:minecraft.subcommands.namehistory.title', { name: findPlayer.name }), `https://visage.surgeplay.com/head/512/${findPlayer.uuid}.png`)
      ).then(channel.stopTyping())
    } else {
      channel.stopTyping()
      throw new CommandError(t('commands:minecraft.subcommands.namehistory.unknownName'))
    }
  }

  async nameToUUID (name) {
    const { body } = await snekfetch.get(`https://api.mojang.com/users/profiles/minecraft/${name}?at=${moment().format('x')}`)
    if (body.id) return { uuid: body.id, name: body.name }
    return false
  }

  async uuidToName (uuid) {
    const { body } = await snekfetch.get(`https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`)
    if (body.id) return { uuid: body.id, name: body.name }
    return false
  }
}
