const { CommandStructures, SwitchbladeEmbed, CommandParameters } = require('../../')
const { Command, CommandRequirements, RoleParameter } = CommandStructures

module.exports = class RoleInfo extends Command {
  constructor (client) {
    super(client)
    this.name = 'roleinfo'
    this.aliases = ['rolinfo', 'rol', 'ri', 'roli']
    this.category = 'utility'
    this.requirements = new CommandRequirements(this, { guildOnly: true })

    this.parameters = new CommandParameters(this,
      new RoleParameter({ full: true, required: false })
    )
  }

  run ({ t, author, channel, language }, role) {
    console.log(role)
  }
}
