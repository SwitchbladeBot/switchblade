const { Command, CommandError, SwitchbladeEmbed } = require('../../../')

const moment = require('moment')

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
    moment.locale(language)
    try {
      const findPlayer = await this.client.apis.minecraft.nameToUUID(name) || await this.client.apis.minecraft.uuidToName(name)
      if (findPlayer.uuid) {
        const nameHistory = await this.client.apis.minecraft.getPreviousNames(findPlayer.uuid)
        channel.send(
          new SwitchbladeEmbed(author)
            .setDescription(nameHistory.map(n => `\`${n.name}\` (${n.changedToAt ? moment(n.changedToAt).fromNow() : t('commands:minecraft.subcommands.namehistory.originalname')})`).join('\n'))
            .setTitle(t('commands:minecraft.namemcprofile'))
            .setURL(`https://namemc.com/profile/${findPlayer.uuid}`)
            .setAuthor(t('commands:minecraft.subcommands.namehistory.title', { name: findPlayer.name }), `https://crafatar.com/avatars/${findPlayer.uuid}.png?overlay=true`)
        )
      } else {
        throw new CommandError(t('commands:minecraft.subcommands.namehistory.unknownName'))
      }
    } catch (e) {
      throw new CommandError(t('errors:generic'))
    }
  }
}
