const { CommandStructures, SwitchbladeEmbed } = require('../../index')
const { Command, CommandParameters, CommandRequirements, StringParameter } = CommandStructures
const i18next = require('i18next')

module.exports = class SetLanguage extends Command {
  constructor (client) {
    super(client)
    this.name = 'setlanguage'
    this.aliases = ['setlang']

    this.requirements = new CommandRequirements(this, {guildOnly: true, databaseOnly: true, permissions: ['MANAGE_GUILD']})

    this.parameters = new CommandParameters(this,
      new StringParameter({full: true,
        fullJoin: '-',
        whitelist: () => Object.keys(i18next.store.data),
        missingError: ({ t }) => {
          return {
            title: t('commands:setlanguage.noCode'),
            description: [
              `**${t('commons:usage')}:** \`${process.env.PREFIX}${this.name} ${t('commands:setlanguage.commandUsage')}\``,
              '',
              `__**${t('commands:setlanguage.availableLanguages')}:**__`,
              `**${Object.keys(i18next.store.data).map(l => `\`${l}\``).join(', ')}**`
            ].join('\n')
          }
        }})
    )
  }

  async run ({ t, author, channel, guild, guildDocument }, lang) {
    const embed = new SwitchbladeEmbed(author)
    lang = lang.replace('_')
    guildDocument.language = lang
    await guildDocument.save()
    embed.setTitle(i18next.getFixedT(lang)('commands:setlanguage.changedSuccessfully', {lang}))
    channel.send(embed)
  }
}
