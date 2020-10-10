const { Command, CommandError, SwitchbladeEmbed, Constants } = require('../../')
const { cleanContent } = require('discord.js').Util

module.exports = class searchPlate extends Command {
  constructor (client) {
    super({
      name: 'searchplate',
      alias: [ 'searchPlate' ],
      category: 'government',
      requirements: {
        apis: [ 'sinesp', 'gsearch' ]
      },
      parameters: [{
        type: 'string',
        full: true,
        missingError: 'commands:searchplate.notFound'
      }]
    }, client)
  }

  async run ({ t, author, channel, message }, plt) {
    channel.startTyping()
    const plate = await this.client.apis.sinesp.searchPlate(plt)
    try {
      // vv  i know that's actually hardcoded :hahaa:
      const carpic = await this.client.apis.gsearch.searchImage(`${plate.modelo} ${plate.anoModelo} a venda&imgSize=medium`)
      channel.send(
        new SwitchbladeEmbed()
          .setDescription(`**${t('commands:searchplate.plate')}**: ${plate.placa}\n**${t('commands:searchplate.model')}**: ${plate.marca} ${plate.modelo}\n**${t('commands:searchplate.year')}**: ${plate.anoModelo}\n**${t('commands:searchplate.color')}**: ${plate.cor}\n**${t('commands:searchplate.city')}**: ${plate.municipio} - ${plate.uf}\n**${t('commands:searchplate.status')}**: ${(plate.situacao !== 'Roubo/Furto') ? t('commands:searchplate.notstolen') : `**${t('commands:searchplate.stolen')}**`}\n**${t('commands:searchplate.chassis')}**: ${cleanContent(plate.chassi, message)}\n\n**${t('commands:searchplate.image')}**:`)
          .setImage(carpic.items[0].link || 'https://i.imgur.com/awMCwj3.jpg')
          .setColor((plate.situacao !== 'Roubo/Furto') ? Constants.GUILD_ADDED_COLOR : Constants.GUILD_LOST_COLOR)
      )
      channel.stopTyping(true)
    } catch (e) {
      channel.stopTyping(true)
      throw new CommandError(t('commands:searchplate.notFound'))
    }
  }
}
