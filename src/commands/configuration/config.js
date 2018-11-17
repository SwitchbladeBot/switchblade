const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../')
const { Command, CommandParameters, CommandRequirements, StringParameter } = CommandStructures

const i18next = require('i18next')

const languageCodes = () => Object.keys(i18next.store.data)
const languageAliases = (cli) => Object.values(cli.cldr.languages).map(v => Object.values(v)).reduce((a, v) => a.concat(v), []).reduce((a, v) => a.concat(v), [])

const ROLE_REGEX = /[^<@&>](\d+)/

module.exports = class Config extends Command {
  constructor (client) {
    super(client)
    this.name = 'config'
    this.aliases = ['cfg']
    this.category = 'configuration'
    this.subcommands = [new ConfigLanguage(client, this), new ConfigPrefix(client, this), new ConfigDJRole(client, this)]

    this.requirements = new CommandRequirements(this, { guildOnly: true, databaseOnly: true, permissions: ['MANAGE_GUILD'] })
  }

  run ({ t, author, prefix, alias, channel, guildDocument }) {
    const embed = new SwitchbladeEmbed(author)
    embed.setDescription([
      t('commands:config.guildPrefix', { command: `${prefix}${alias || this.name}` }),
      t('commands:config.guildLang', { command: `${prefix}${alias || this.name}` })
    ].join('\n'))
    channel.send(embed)
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
        missingError: ({ t, prefix }) => {
          return {
            title: t('commands:config.subcommands.language.noCode'),
            description: [
              `**${t('commons:usage')}:** \`${prefix}${parentCommand.name} ${this.name} ${t('commands:config.subcommands.language.commandUsage')}\``,
              '',
              `__**${t('commands:config.subcommands.language.availableLanguages')}:**__`,
              `**${languageCodes().map(l => `\`${l}\``).join(', ')}**`,
              '',
              `${t('commands:config.missingTranslation')}`
            ].join('\n')
          }
        } })
    )
  }

  async run ({ t, author, channel, guildDocument }, lang) {
    lang = lang.toLowerCase()
    const langCodes = languageCodes()
    const langDisplayNames = this.client.cldr.languages
    if (!langCodes.some(l => l.toLowerCase() === lang)) {
      lang = langCodes.find(lc => langDisplayNames[lc] && Object.values(langDisplayNames[lc]).reduce((a, v) => a.concat(v), []).includes(lang))
    }

    lang = langCodes.find(l => l.toLowerCase() === lang.toLowerCase())
    const language = langDisplayNames[lang] && langDisplayNames[lang][lang]
    const langDisplayName = language && language[0]

    const embed = new SwitchbladeEmbed(author)
    guildDocument.language = lang
    guildDocument.save()
    embed.setTitle(i18next.getFixedT(lang)('commands:config.subcommands.language.changedSuccessfully', { lang: langDisplayName || lang }))
    channel.send(embed)
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

  async run ({ t, author, channel, guildDocument }, prefix) {
    const embed = new SwitchbladeEmbed(author)
    prefix = prefix || process.env.PREFIX
    guildDocument.prefix = prefix
    await guildDocument.save()
    embed.setTitle(t('commands:config.subcommands.prefix.changedSuccessfully', { prefix }))
    channel.send(embed)
  }
}

class ConfigDJRole extends Command {
  constructor (client, parentCommand) {
    super(client, parentCommand)
    this.name = 'djrole'

    this.parameters = new CommandParameters(this,
      new StringParameter({ full: true, required: false, missingError: 'errors:invalidRole' })
    )
  }

  async run ({ t, author, channel, guildDocument }, role) {
    const regexResult = await ROLE_REGEX.exec(role)
    let roleId = regexResult[0]
    const embed = new SwitchbladeEmbed(author)
    const guildrole = await channel.guild.roles.find(r => r.id === roleId)
    if (!guildrole) {
      embed
        .setTitle(t('errors:invalidRole'))
        .setColor(Constants.ERROR_COLOR)
    } else {
      guildDocument.djRole = guildrole.id
      await guildDocument.save()
      embed.setDescription(t('commands:config.subcommands.djrole.changedSuccessfully', { roleId }))
    }
    channel.send(embed)
  }
}
