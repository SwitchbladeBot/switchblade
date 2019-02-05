const { CommandStructures, SwitchbladeEmbed } = require('../../')
const { Command, CommandParameters, StringParameter, CommandError } = CommandStructures

const i18next = require('i18next')

const languageCodes = () => Object.keys(i18next.store.data)
const languageAliases = (cli) => Object.values(cli.cldr.languages).map(v => Object.values(v)).reduce((a, v) => a.concat(v), []).reduce((a, v) => a.concat(v), [])

module.exports = class ConfigLanguage extends Command {
  constructor (client, parentCommand) {
    super(client, parentCommand || 'config')
    this.name = 'language'
    this.aliases = ['lang']

    this.parameters = new CommandParameters(this,
      new StringParameter({
        full: true,
        whitelist: (arg) => languageCodes().concat(languageAliases(this.client)).some(l => l.toLowerCase() === arg.toLowerCase()),
        missingError: ({ t, prefix, author }) => {
          return new SwitchbladeEmbed().setTitle(t('commands:config.subcommands.language.noCode'))
            .setDescription([
              this.usage(t, prefix),
              '',
              `__**${t('commands:config.subcommands.language.availableLanguages')}:**__`,
              `**${languageCodes().map(l => `\`${l}\``).join(', ')}**`,
              '',
              `${t('commands:config.missingTranslation')}`
            ].join('\n'))
        }
      })
    )
  }

  async run ({ t, author, channel, guild }, lang) {
    lang = lang.toLowerCase()
    const langCodes = languageCodes()
    const langDisplayNames = this.client.cldr.languages
    if (!langCodes.some(l => l.toLowerCase() === lang)) {
      lang = langCodes.find(lc => langDisplayNames[lc] && Object.values(langDisplayNames[lc]).reduce((a, v) => a.concat(v), []).includes(lang))
    }

    lang = langCodes.find(l => l.toLowerCase() === lang.toLowerCase())
    const language = langDisplayNames[lang] && langDisplayNames[lang][lang]
    const langDisplayName = language && language[0]

    try {
      await this.client.modules.configuration.setLanguage(guild.id, lang)
      channel.send(
        new SwitchbladeEmbed(author)
          .setTitle(i18next.getFixedT(lang)('commands:config.subcommands.language.changedSuccessfully', { lang: langDisplayName || lang }))
      )
    } catch (e) {
      throw new CommandError(t('errors:generic'))
    }
  }
}
