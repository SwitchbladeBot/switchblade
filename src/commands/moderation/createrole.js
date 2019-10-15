const { Command, SwitchbladeEmbed, Constants, Color } = require('../../')

module.exports = class CreateRole extends Command {
  constructor (client) {
    super(client, {
      name: 'createrole',
      category: 'moderation',
      requirements: { guildOnly: true, botPermissions: ['MANAGE_ROLES'], permissions: ['MANAGE_ROLES'] },
      parameters: [
        { type: 'string', full: false, missingError: 'commands:createrole.noParams', required: true },
        { type: 'color', required: false }
      ]

    })
  }

  async run ({ channel, guild, author, t }, name, color = new Color('#ffffff')) {
    const hexcode = color.rgb(true)
    const embed = new SwitchbladeEmbed(author)
    await guild.createRole({ name, color: hexcode }).then(role => {
      embed
        .setTitle(t('commands:createrole.successTitle'))
        .setDescription(t('commands:createrole.successMessage', { name }))
        .setColor(hexcode)
    }).catch(err => {
      embed
        .setColor(Constants.ERROR_COLOR)
        .setTitle(t('commands:createrole.errorTitle'))
        .setDescription(`\`${err}\``)
    })

    channel.send(embed)
  }
}
