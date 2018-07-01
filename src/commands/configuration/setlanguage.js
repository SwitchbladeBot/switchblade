const { CommandStructures, SwitchbladeEmbed } = require('../../index')
const { Command, CommandParameters, CommandRequirements, StringParameter } = CommandStructures

const i18next = require('i18next')

const languageCodes = () => Object.keys(i18next.store.data)
const languageAliases = (cli) => Object.values(cli.cldr.languages).map(v => Object.values(v)).reduce((a, v) => a.concat(v), []).reduce((a, v) => a.concat(v), [])

module.exports = class SetLanguage extends Command {
  constructor (client) {
    super(client)
    this.name = 'setlanguage'
    this.aliases = ['setlang']

    this.requirements = new CommandRequirements(this, {guildOnly: true, databaseOnly: true, permissions: ['MANAGE_GUILD']})

    this.parameters = new CommandParameters(this,
      new StringParameter({
        full: true,
        whitelist: () => languageCodes().concat(languageAliases(this.client)),
        missingError: ({t}) => {
          return {
            title: t('commands:setlanguage.noCode'),
            description: [
              `**${t('commons:usage')}:** \`${process.env.PREFIX}${this.name} ${t('commands:setlanguage.commandUsage')}\``,
              '',
              `__**${t('commands:setlanguage.availableLanguages')}:**__`,
              `**${Object.keys(i18next.store.data).map(l => `\`${l}\``).join(', ')}**`
            ].join('\n')
          }
        }
      })
    )
  }

  async run ({ t, author, channel, guild, guildDocument }, lang) {
    const langCodes = languageCodes()
    const langDisplayNames = this.client.cldr.languages
    if (!langCodes.includes(lang)) {
      lang = langCodes.find(lc => langDisplayNames[lc] && Object.values(langDisplayNames[lc]).reduce((a, v) => a.concat(v), []).includes(lang.toLowerCase()))
    }

    const language = langDisplayNames[lang] && langDisplayNames[lang][lang]
    const langDisplayName = language && language[0]

    const embed = new SwitchbladeEmbed(author)
    guildDocument.language = lang
    guildDocument.save()
    embed.setTitle(i18next.getFixedT(lang)('commands:setlanguage.changedSuccessfully', { lang: langDisplayName || lang }))
    channel.send(embed)
  }
}
