const { Command, SwitchbladeEmbed, Constants } = require('../../index')
const i18next = require('i18next')

module.exports = class SetLanguage extends Command {
  constructor (client) {
    super(client)
    this.name = 'setlanguage'
    this.aliases = ['setlang']
  }

  async run (message, args, t) {
    const embed = new SwitchbladeEmbed(message.author)
    if (message.guild) {
      if (message.member.hasPermission('MANAGE_GUILD')) {
        const availableLangs = Object.keys(i18next.store.data)
        if (args.length > 0) {
          const lang = args.join('-').replace('_')
          if (availableLangs.includes(lang)) {
            const guildDocument = await this.client.database.guilds.get(message.guild.id)
            guildDocument.language = lang
            await guildDocument.save()
            const updatedT = i18next.getFixedT(lang)
            embed.setTitle(updatedT('commands:setlanguage.changedSuccessfully', {lang}))
          } else {
            embed
              .setColor(Constants.ERROR_COLOR)
              .setTitle(t('commands:setlanguage.noCode'))
              .setDescription([
                `**${t('commons:usage')}:** \`${process.env.PREFIX}${this.name} ${t('commands:setlanguage.commandUsage')}\``,
                '',
                `__**${t('commands:setlanguage.availableLanguages')}:**__`,
                `**${availableLangs.map(l => `\`${l}\``).join(', ')}**`
              ].join('\n'))
          }
        } else {
          embed
            .setColor(Constants.ERROR_COLOR)
            .setTitle(t('commands:setlanguage.noCode'))
            .setDescription([
              `**${t('commons:usage')}:** \`${process.env.PREFIX}${this.name} ${t('commands:setlanguage.commandUsage')}\``,
              '',
              `__**${t('commands:setlanguage.availableLanguages')}:**__`,
              `**${availableLangs.map(l => `\`${l}\``).join(', ')}**`
            ].join('\n'))
        }
      } else {
        embed
          .setColor(Constants.ERROR_COLOR)
          .setTitle(t('errors:missingOnePermission', {permission: `**"${t('permissions:MANAGE_GUILD')}"**`}))
      }
    } else {
      embed
        .setColor(Constants.ERROR_COLOR)
        .setTitle(t('errors:guildOnly'))
    }
    message.channel.send(embed)
  }
}