const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../')
const { Command, CommandRequirements } = CommandStructures

module.exports = class GuildIcon extends Command {
  constructor (client) {
    super(client)
    this.name = 'guildicon'
    this.aliases = ['gicon', 'sicon', 'srvicn', 'servericon']
    this.requirements = new CommandRequirements(this, { guildOnly: true })
  }

  run ({ t, author, channel, guild }) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    if (guild.iconURL) {
      embed.setImage(guild.iconURL)
        .setDescription(t('commands:guildicon.iconDescription', {guild: guild.name}))
    } else {
      embed.setDescription(t('commands:guildicon.noIcon'))
        .setColor(Constants.ERROR_COLOR)
    }
    channel.send(embed).then(() => channel.stopTyping())
  }
}
