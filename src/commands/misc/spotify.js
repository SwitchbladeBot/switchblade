const { CommandStructures, SwitchbladeEmbed } = require('../../')
const { Command, CommandParameters, StringParameter, CommandRequirements } = CommandStructures

const types = ['track', 'song', 't', 's', 'album', 'al', 'artist', 'ar', 'playlist', 'p', 'user', 'u']

module.exports = class Spotify extends Command {
  constructor (client) {
    super(client)

    this.name = 'spotify'
    this.aliases = ['sp']
    this.requirements = new CommandRequirements(this, { apis: ['spotify'] })

    this.SPOTIFY_LOGO = 'https://i.imgur.com/vw8svty.png'

    this.parameters = new CommandParameters(this,
      new StringParameter({
        full: true,
        whitelist: types,
        required: true,
        missingError: ({ t, prefix }) => {
          return new SwitchbladeEmbed().setTitle(t('commons:search.noType'))
            .setDescription([
              this.usage(t, prefix),
              '',
              `__**${t('commons:search.types')}:**__`,
              `\`${['track', 'album', 'artist', 'playlist', 'user'].join('`, `')}\``
            ].join('\n'))
        }
      })
    )
  }
}
