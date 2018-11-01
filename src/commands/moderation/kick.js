const { CommandStructures, Constants, SwitchbladeEmbed } = require('../../')
const { Command, CommandRequirements, CommandParameters, StringParameter, MemberParameter } = CommandStructures

module.exports = class Kick extends Command {
  constructor (client) {
    super(client)
    this.name = 'kick'
    this.aliases = ['expulsar']
    this.category = 'moderation'

    this.requirements = new CommandRequirements(this, { guildOnly: true, botPermissions: ['KICK_MEMBERS'], permissions: ['KICK_MEMBERS'] })
    this.parameters = new CommandParameters(this,
      new MemberParameter({ acceptBot: true, missingError: 'commands:kick.missingUser' }),
      new StringParameter({ full: true, missingError: 'commands:kick.missingReason' })
    )
  }

  async run ({ channel, guild, author, t }, member, reason) {
    const embed = new SwitchbladeEmbed(author)
    await member.kick(reason).then(kickedMember => {
      embed
        .setTitle(t('commands:kick.successTitle'))
        .setDescription(`${kickedMember} - \`${reason}\``)
    }).catch(err => {
      embed
        .setColor(Constants.ERROR_COLOR)
        .setTitle(t('commands:kick.cantKick'))
        .setDescription(`\`${err}\``)
    })
    channel.send(embed)
  }
}
