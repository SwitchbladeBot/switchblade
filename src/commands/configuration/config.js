const { CommandStructures, SwitchbladeEmbed } = require('../../')
const { Command, CommandParameters, CommandRequirements, StringParameter, CommandError } = CommandStructures

const i18next = require('i18next')

const languageCodes = () => Object.keys(i18next.store.data)
const languageAliases = (cli) => Object.values(cli.cldr.languages).map(v => Object.values(v)).reduce((a, v) => a.concat(v), []).reduce((a, v) => a.concat(v), [])

module.exports = class Config extends Command {
  constructor (client) {
    super(client)
    this.name = 'config'
    this.aliases = ['cfg']
    this.category = 'configuration'
    this.subcommands = [new ConfigLanguage(client, this), new ConfigPrefix(client, this)]

    this.requirements = new CommandRequirements(this, { guildOnly: true, databaseOnly: true, permissions: ['MANAGE_GUILD'] })
  }

  run ({ t, author, prefix, alias, channel }) {
    channel.send(
      new SwitchbladeEmbed(author)
        .setDescription([
          t('commands:config.guildPrefix', { command: `${prefix}${alias || this.name}` }),
          t('commands:config.guildLang', { command: `${prefix}${alias || this.name}` })
        ].join('\n'))
    )
  }
}

class ConfigLanguage extends Command {
  constructor (client, parentCommand) {
    super(client, parentCommand)
    this.name = 'language'
    this.aliases = ['lang']

    this.parameters = new CommandParameters(this,
      new StringParameter({
        full: true,
        whitelist: (arg) => languageCodes().concat(languageAliases(this.client)).some(l => l.toLowerCase() === arg.toLowerCase()),
        missingError: ({ t, prefix, author }) => {
          return new SwitchbladeEmbed().setTitle(t('commands:config.subcommands.language.noCode'))
            .setDescription([
              `**${t('commons:usage')}:** \`${prefix}${parentCommand.name} ${this.name} ${t('commands:config.subcommands.language.commandUsage')}\``,
              '',
              `__**${t('commands:config.subcommands.language.availableLanguages')}:**__`,
              `**${languageCodes().map(l => `\`${l}\``).join(', ')}**`,
              '',
              `${t('commands:config.missingTranslation')}`
            ].join('\n'))
            .setFooter(author.tag)
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

class ConfigPrefix extends Command {
  constructor (client, parentCommand) {
    super(client, parentCommand)
    this.name = 'prefix'

    this.parameters = new CommandParameters(this,
      new StringParameter({ full: true, required: false, missingError: 'commands:config.subcommands.prefix.noPrefix' })
    )
  }

  async run ({ t, author, channel, guild }, prefix = process.env.PREFIX) {
    try {
      await this.client.modules.configuration.setPrefix(guild.id, prefix)
      channel.send(
        new SwitchbladeEmbed(author)
          .setTitle(t('commands:config.subcommands.prefix.changedSuccessfully', { prefix }))
      )
    } catch (e) {
      throw new CommandError(t('errors:generic'))
    }
  }
}
