const { Command, SwitchbladeEmbed } = require('../../../')
const fetch = require('node-fetch')

const servers = ['na', 'euw', 'eune', 'lan', 'las', 'br', 'tr', 'ru', 'oce', 'jp', 'kr']

module.exports = class LeagueOfLegendsStatus extends Command {
  constructor (client) {
    super({
      name: 'status',
      aliases: ['s'],
      parent: 'leagueoflegends',
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
    }, client)
  }

  async run ({ t, author, channel, language }, server) {
    channel.startTyping()
    const body = await fetch(`http://status.leagueoflegends.com/shards/${server}/summary`).then(res => res.json())
    channel.send(
      new SwitchbladeEmbed(author)
        .setDescription(
          [
            `${this.getEmoji(`lol${body.status}`)} **[${t(`lolservers:${server}`)} - ${t(`commands:leagueoflegends.subcommands.status.${body.status}`)}](https://status.leagueoflegends.com/?${language.replace('-', '_')}#${server})**\n`,
            body.messages
              ? body.messages.map(m => `${this.getEmoji(`lol${m.severity}`)} **${t(`commands:leagueoflegends.subcommands.status.${m.severity}`)}:** ${this.getLocalizedContent(m, language)}`).join('\n\n')
              : null
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
