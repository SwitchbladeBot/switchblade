const { Command, SwitchbladeEmbed } = require('../../')

const types = ['server', 'sv', 'namehistory', 'skin', 's', 'nh', 'nameh', 'minecraftskin', 'mskin']

module.exports = class Minecraft extends Command {
  constructor (client) {
    super(client, {
      name: 'minecraft',
      aliases: ['minecraftquery', 'mc', 'mcquery'],
      category: 'games',
      parameters: [{
        type: 'string',
        full: true,
        whitelist: types,
        missingError: ({ t, prefix }) => {
          return new SwitchbladeEmbed().setTitle(t('commons:search.noType'))
            .setDescription([
              this.usage(t, prefix),
              '',
              `__**${t('commons:search.types')}:**__`,
              `\`${['server', 'namehistory', 'skin'].join('`, `')}\``
            ].join('\n'))
        }
      }]
    })

    this.MINECRAFT_LOGO = 'https://i.imgur.com/DBkQ0K5.png'
  }
}
