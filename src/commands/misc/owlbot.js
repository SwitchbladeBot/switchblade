const { Command, CommandError, SwitchbladeEmbed, Constants } = require('../../')

module.exports = class Owlbot extends Command {
  constructor (client) {
    super({
      name: 'owlbot',
      aliases: ['owl'],
      requirements: {
        apis: ['owlbot']
      },
      parameters: [{
        type: 'string',
        full: true,
        missingError: 'commands:owlbot.noWord'
      }]
    }, client)
  }

  async run ({ t, channel }, word) {
    channel.startTyping()
    try {
      const { data } = await this.client.apis.owlbot.request(word)
      const embed = new SwitchbladeEmbed()
        .setTitle(data.word)
        .addFields(
          data.definitions.map(d =>
            ({
              name: d.type,
              value: `${d.definition}${d.example ? `\n"_${d.example}_"` : ''}`
            })
          )
        )
        .setColor(Constants.OWLBOT_COLOR)
        .setFooter(
          t('commands:owlbot.footer'),
          'https://media.owlbot.info/dictionary/images/owlbot.png.400x400_q85_box-0,0,287,288_crop_detail.png'
        )
      if (data.pronunciation) embed.setDescription(`/${data.pronunciation}/`)
      const definitionWithImage = data.definitions.find(d => d.image_url)
      if (definitionWithImage) embed.setThumbnail(definitionWithImage.image_url)
      channel.send(embed).then(() => channel.stopTyping())
    } catch (err) {
      channel.stopTyping()
      if (err.response && err.response.status === 404) {
        throw new CommandError(t('commands:owlbot.notFound'))
      } else {
        throw new CommandError(t('commands:owlbot.error'))
      }
    }
  }
}
