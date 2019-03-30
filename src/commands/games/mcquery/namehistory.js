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
    const { body } = await snekfetch.get(`https://api.mojang.com/users/profiles/minecraft/${name}?at=${moment().format('x')}`)

    if (body && body.id) {
      const nameHistory = await snekfetch.get(`https://api.mojang.com/user/profiles/${body.id}/names`)
      channel.send(
        new SwitchbladeEmbed(author)
          .setDescription(nameHistory.body.map(n => `\`${n.name}\` (${n.changedToAt ? moment(n.changedToAt).fromNow() : 'Original Name'})`).join('\n'))
          .setTitle('NameMC profile (click here)')
          .setURL(`https://namemc.com/profile/${body.id}`)
          .setAuthor(`${body.name}'s name history!`, `https://visage.surgeplay.com/head/512/${body.id}.png`)
      ).then(channel.stopTyping())
    } else {
      channel.stopTyping()
      throw new CommandError(t('commands:minecraft.subcommands.namehistory.unknownName'))
    }
  }
}
