const { CommandStructures, Constants, SwitchbladeEmbed } = require('../../')
const { Command, CommandRequirements, CommandParameters, StringParameter, MemberParameter } = CommandStructures

module.exports = class Softban extends Command {
  constructor (client) {
    super(client)
    this.name = 'softban'
    this.aliases = ['softbanir']
    this.category = 'moderation'

    this.requirements = new CommandRequirements(this, { guildOnly: true, botPermissions: ['BAN_MEMBERS'], permissions: ['BAN_MEMBERS'] })
    this.parameters = new CommandParameters(this,
      new MemberParameter({ acceptBot: true, missingError: 'commands:softban.missingUser' }),
      new StringParameter({ full: true, missingError: 'commands:softban.missingReason' })
    )
  }

  async run ({ channel, guild, author, t }, member, reason) {
    const embed = new SwitchbladeEmbed(author)
    await guild.ban(member, { days: 7, reason }).then(async bannedMember => {
      await guild.unban(bannedMember).then(softbannedMember => {
        embed
          .setTitle(t('commands:softban.successTitle'))
          .setDescription(`${softbannedMember} - \`${reason}\``)
      })
    }).catch(err => {
      embed
        .setColor(Constants.ERROR_COLOR)
        .setTitle(t('commands:softban.cantSoftban'))
        .setDescription(`\`${err}\``)
    })
    channel.send(embed)
  }
}
