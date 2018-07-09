const { CommandStructures, SwitchbladeEmbed } = require('../../')
const { Command, CommandParameters, CommandRequirements, StringParameter } = CommandStructures
const i18next = require('i18next')

module.exports = class Config extends Command {
  constructor (client) {
    super(client)
    this.name = 'config'
    this.aliases = ['cfg']
    this.subcommands = [new ConfigLanguage(client, this), new ConfigPrefix(client, this)]

    this.requirements = new CommandRequirements(this, {guildOnly: true, databaseOnly: true, permissions: ['MANAGE_GUILD']})
  }

  run ({ t, author, prefix, alias, channel, guildDocument }) {
    const embed = new SwitchbladeEmbed(author)
    embed.setDescription([
      t('commands:config.guildLang', { command: `${prefix}${alias || this.name}` }),
      t('commands:config.guildPrefix', { command: `${prefix}${alias || this.name}` })
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
      new StringParameter({full: true,
        fullJoin: '-',
        whitelist: () => Object.keys(i18next.store.data),
        missingError: ({ t, prefix }) => {
          return {
            title: t('commands:config.subcommands.language.noCode'),
            description: [
              `**${t('commons:usage')}:** \`${prefix}${this.name} ${t('commands:config.subcommands.language.commandUsage')}\``,
              '',
              `__**${t('commands:config.subcommands.language.availableLanguages')}:**__`,
              `**${Object.keys(i18next.store.data).map(l => `\`${l}\``).join(', ')}**`
            ].join('\n')
          }
        }})
    )
  }

  async run ({ t, author, channel, guildDocument }, lang) {
    const embed = new SwitchbladeEmbed(author)
    lang = lang.replace('_')
    guildDocument.language = lang
    await guildDocument.save()
    embed.setTitle(i18next.getFixedT(lang)('commands:config.subcommands.language.changedSuccessfully', {lang}))
    channel.send(embed)
  }
}

class ConfigPrefix extends Command {
  constructor (client, parentCommand) {
    super(client, parentCommand)
    this.name = 'prefix'

    this.parameters = new CommandParameters(this,
      new StringParameter({ full: true, missingError: 'commands:config.subcommands.prefix.noPrefix' })
    )
  }

  async run ({ t, author, channel, guildDocument }, prefix) {
    const embed = new SwitchbladeEmbed(author)
    guildDocument.prefix = prefix
    await guildDocument.save()
    embed.setTitle(t('commands:config.subcommands.prefix.changedSuccessfully', {prefix}))
    channel.send(embed)
  }
}
