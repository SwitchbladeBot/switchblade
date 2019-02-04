const { CommandStructures, SwitchbladeEmbed } = require('../../')
const { Command, CommandRequirements, CommandParameters, StringParameter } = CommandStructures

const types = ['track', 'song', 't', 's', 'album', 'al', 'artist', 'ar', 'playlist', 'p', 'user', 'u']

module.exports = class Deezer extends Command {
  constructor (client) {
    super(client)

    this.name = 'deezer'
    this.aliases = ['dz']

    this.requirements = new CommandRequirements(this, { apis: ['deezer'] })
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
