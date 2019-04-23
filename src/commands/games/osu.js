const { Command, SwitchbladeEmbed } = require('../../')

const types = ['player', 'p', 'beatmap', 'b', 'register', 'reg', 'r']

module.exports = class Osu extends Command {
  constructor (client) {
    super(client, {
      name: 'osu',
      category: 'games',
      requirements: { apis: ['osu'] },
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
              `\`${['player', 'beatmap', 'register'].join('`, `')}\``
            ].join('\n'))
        }
      }]
    })

    this.OSU_LOGO = 'https://i.imgur.com/Ek0hnam.png'
    this.OSU_COLOR = '#E7669F'
    this.modes = {
      'osu': ['0', 'osu!'],
      'taiko': ['1', 'osu!taiko'],
      'catchthebeat': ['2', 'osu!catch'],
      'mania': ['3', 'osu!mania']
    }
  }
}
