const { Command, CommandError, SwitchbladeEmbed } = require('../../')

module.exports = class GuildIcon extends Command {
  constructor (client) {
    super({
      name: 'guildicon',
      aliases: ['gicon', 'sicon', 'srvicn', 'servericon'],
      category: 'utility',
      requirements: { guildOnly: true },
      parameters: [{
        type: 'guild',
        full: true,
        required: false
      }]
    }, client)
  }

  run ({ t, author, channel }, guild = channel.guild) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    guild = guild || channel.guild
    if (guild.iconURL) {
      embed.setImage(guild.iconURL({ format: 'png', dynamic: true }))
        .setDescription(t('commands:guildicon.iconDescription', { guild: guild.name }))
    } else {
      throw new CommandError(t('commands:guildicon.noIcon'))
    }
    channel.send(embed).then(() => channel.stopTyping())
  }
}
