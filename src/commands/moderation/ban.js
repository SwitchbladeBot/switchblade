const { CommandStructures, Constants, SwitchbladeEmbed } = require('../../')
const { Command, CommandRequirements, CommandParameters, StringParameter, MemberParameter } = CommandStructures

module.exports = class Ban extends Command {
  constructor (client) {
    super(client)
    this.name = 'ban'
    this.aliases = ['banir']
    this.category = 'moderation'

    this.requirements = new CommandRequirements(this, { guildOnly: true, botPermissions: ['BAN_MEMBERS'], permissions: ['BAN_MEMBERS'] })
    this.parameters = new CommandParameters(this,
      new MemberParameter({ acceptBot: true, missingError: 'commands:ban.missingUser' }),
      new StringParameter({ full: true, missingError: 'commands:ban.missingReason' })
    )
  }

  async run ({ channel, guild, author, t }, member, reason) {
    const embed = new SwitchbladeEmbed(author)
    await guild.ban(member, { days: 7, reason }).then(bannedMember => {
      embed
        .setTitle(t('commands:ban.successTitle'))
        .setDescription(`${bannedMember} - \`${reason}\``)
    }).catch(err => {
      embed
        .setColor(Constants.ERROR_COLOR)
        .setTitle(t('commands:ban.cantBan'))
        .setDescription(`\`${err}\``)
    })
    channel.send(embed)
  }
}
