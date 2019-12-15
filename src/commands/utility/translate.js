const { SwitchbladeEmbed, Command } = require('../../')

module.exports = class TranslateCommand extends Command {
  constructor (client) {
    super({
      name: 'translate',
      aliases: ['translator'],
      parameters: [
        {
          type: 'string'
        },
        {
          type: 'string'
        },
        {
          type: 'string',
          full: true,
          clean: true
        }
      ]
    }, client)
  }

  async run ({ t, author, channel, language }, from, to, text) {
    channel.startTyping()
    const embed = new SwitchbladeEmbed(author)

    const languages = require(`../../locales/${language}/languages.json`)
    const languageCodes = Object.keys(languages)

    const wasFallback = !languageCodes.slice(1).includes(to)

    if (!languageCodes.includes(from)) from = 'auto'
    if (wasFallback) to = 'en'

    const { translated, from: fromT, to: toT } = await this.client.apis.gtranslate.translateText(from, to, text)

    const auto = from === 'auto' ? ' ' + t('commands:translate.automatic') : ''
    embed.setDescription(translated.length > 2000 ? translated.slice(0, 2000) + '...' : translated)
      .addField(t('commands:translate.translatedFrom'), languages[fromT] + auto, true)
      .addField(t('commands:translate.translatedTo'), languages[toT], true)
      .setAuthor(t('commands:translate.title'), 'https://i.imgur.com/FQuOtF5.jpg')
    channel.send(embed)
      .then(() => channel.stopTyping())
  }
}
