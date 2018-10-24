const { CommandStructures, SwitchbladeEmbed, Constants, CommandParameters } = require('../../')
const { Command, CommandRequirements, GuildParameter } = CommandStructures

module.exports = class GuildIcon extends Command {
  constructor (client) {
    super(client)
    this.name = 'guildicon'
    this.aliases = ['gicon', 'sicon', 'srvicn', 'servericon']
    this.category = 'utility'
    this.requirements = new CommandRequirements(this, { guildOnly: true })

    this.parameters = new CommandParameters(this,
      new GuildParameter({ full: true, required: false })
    )
  }

  run ({ t, author, channel }, guild) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    guild = guild || channel.guild
    if (guild.iconURL) {
      embed.setImage(guild.iconURL)
        .setDescription(t('commands:guildicon.iconDescription', { guild: guild.name }))
    } else {
      embed.setDescription(t('commands:guildicon.noIcon'))
        .setColor(Constants.ERROR_COLOR)
    }
    channel.send(embed).then(() => channel.stopTyping())
  }
}
