const { Command, CommandError, SwitchbladeEmbed } = require('../../../')
const fetch = require('node-fetch')

const servers = ['na', 'euw', 'eune', 'lan', 'las', 'br', 'tr', 'ru', 'oce', 'jp', 'kr']

module.exports = class LeagueOfLegendsStatus extends Command {
  constructor (client) {
    super(client, {
      name: 'status',
      aliases: ['s'],
      category: 'games',
      parentCommand: 'leagueoflegends',
      category: 'games',
      parameters: [{
        type: 'string',
        whitelist: servers,
        missingError: ({ t, prefix }) => {
          return new SwitchbladeEmbed().setTitle(t('commands:leagueoflegends.subcommands.status.missingServer'))
            .setDescription([
              this.usage(t, prefix),
              '',
              `__**${t('commands:leagueoflegends.subcommands.status.availableServers')}:**__`,
              `**${servers.map(l => `\`${l}\``).join(', ')}**`
            ].join('\n'))
        }
      }]
    })
  }

  async run ({ t, author, channel, language }, server) {
    channel.startTyping()
    const body = await fetch(`https://status.leagueoflegends.com/shards/${server}/summary`).then(res => res.json())
    if (!body.messages.length) throw new CommandError(t('commands:leagueoflegends.subcommands.status.noStatusMessages'))
    channel.send(
      new SwitchbladeEmbed(author)
        .setDescription(
          [
            `${this.getEmoji(`lol${body.status}`)} **[${t(`lolservers:${server}`)} - ${t(`commands:leagueoflegends.subcommands.status.${body.status}`)}](https://status.leagueoflegends.com/?${language.replace('-', '_')}#${server})**\n`,
            body.messages.map(m => {
              return `${this.getEmoji(`lol${m.severity}`)} **${t(`commands:leagueoflegends.subcommands.status.${m.severity}`)}:** ${this.getLocalizedContent(m, language)}`
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
