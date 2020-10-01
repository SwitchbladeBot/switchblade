const { Command, SwitchbladeEmbed } = require('../../')

module.exports = class WhatLanguage extends Command {
  constructor (client) {
    super({
      name: 'whatlanguage',
      requirements: { apis: ['languagelayer'] },
      parameters: [{
        type: 'string', full: true, missingError: 'commands:whatlanguage.noText'
      }]
    }, client)
  }

  async run ({ t, author, channel }, query) {
    channel.startTyping()
    const { data } = await this.client.apis.languagelayer.detectText(query)
    const embed = new SwitchbladeEmbed(author)
      .setTitle(t('commands:whatlanguage.embedTitle'))
      .setDescription(t('commands:whatlanguage.embedDes'))
      .addField(t('commands:whatlanguage.fieldLanguage'), `:flag_${data.results[0].language_code}: ${data.results[0].language_name}`, true)
      .addField(t('commands:whatlanguage.fieldProbability'), `${Math.round(data.results[0].probability)}%`, true)
      .addField(t('commands:whatlanguage.fieldPercentage'), `${data.results[0].percentage}%`, true)
    channel.send(embed).then(() => channel.stopTyping())
  }
}
