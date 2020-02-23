const { Command, SwitchbladeEmbed } = require('../../')

const types = ['breach', 'paste', 'b', 'p']

module.exports = class HIBP extends Command {
  constructor (client) {
    super({
      name: 'hibp',
      aliases: ['haveibeenpwned'],
      requirements: { apis: ['hibp'] },
      parameters: [{
        type: 'string',
        full: false,
        whitelist: types,
        missingError: ({ t, prefix }) => {
          return new SwitchbladeEmbed().setTitle(t('commons:search.noType'))
            .setDescription([
              this.usage(t, prefix),
              '',
              `__**${t('commons:search.types')}:**__`,
              `\`${['breach', 'paste'].join('`, `')}\``
            ].join('\n'))
        }
      }]
    }, client)

    this.HIBP_LOGO = 'https://haveibeenpwned.com/Content/Images/SocialLogo.png'
  }
}
