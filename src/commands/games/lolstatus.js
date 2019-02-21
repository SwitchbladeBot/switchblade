const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../')
const { Command, CommandParameters, StringParameter, CommandError } = CommandStructures
const snekfetch = require('snekfetch')

const servers = ['na', 'euw', 'eune', 'lan', 'las', 'br', 'tr', 'ru', 'oce', 'jp', 'kr']

module.exports = class LoLStatus extends Command {
  constructor (client) {
    super(client, {
      name: 'lolstatus',
      category: 'games',
      parameters: [{
        type: 'string',
        whitelist: servers,
        missingError: ({ t, prefix }) => {
          return new SwitchbladeEmbed().setTitle(t('commands:lolstatus.missingServer'))
            .setDescription([
              this.usage(t, prefix),
              '',
              `__**${t('commands:lolstatus.availableServers')}:**__`,
              `**${servers.map(l => `\`${l}\``).join(', ')}**`
            ].join('\n'))
        }
      }]
    })
  }

  async run ({ t, author, channel, language }, server) {
    channel.startTyping()
    const { body } = await snekfetch.get(`https://status.leagueoflegends.com/shards/${server}/summary`)
    if (!body.messages.length) throw new CommandError(t('commands:lolstatus.noStatusMessages'))
    channel.send(
      new SwitchbladeEmbed(author)
        .setDescription(
          [
            `${Constants[`LOL_STATUS_${body.status.toUpperCase()}`]} **[${t(`lolservers:${server}`)} - ${t(`commands:lolstatus.${body.status}`)}](https://status.leagueoflegends.com/?${language.replace('-', '_')}#${server})**\n`,
            body.messages.map(m => {
              return `${Constants[`LOL_STATUS_${m.severity.toUpperCase()}`]} **${t(`commands:lolstatus.${m.severity}`)}:** ${this.getLocalizedContent(m, language)}`
            }).join('\n\n')
          ].join('\n')
        )
        .setColor(body.status === 'online' ? 0x199A19 : 0xDC0607)
    )
    channel.stopTyping()
  }

  getLocalizedContent (message, language) {
    if (message.translations.find(t => t.locale === language.replace('-', '_'))) {
      return message.translations.find(t => t.locale === language.replace('-', '_')).content
    } else {
      return message.content
    }
  }
}
