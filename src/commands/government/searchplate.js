const { Command, CommandError, SwitchbladeEmbed, Constants, CanvasTemplates } = require('../../')
const { cleanContent } = require('discord.js').Util
const { MessageAttachment } = require('discord.js')

module.exports = class searchPlate extends Command {
  constructor (client) {
    super({
      name: 'searchplate',
      alias: ['searchPlate'],
      category: 'government',
      requirements: {
        apis: ['consultaplaca', 'gsearch']
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
    try {
      const plate = await this.client.apis.consultaplaca.searchPlate(plt)
      const mercosulPlate = await CanvasTemplates.plateMercosul(plate.placa, `https://cdn.jsdelivr.net/gh/bgeneto/bandeiras-br/imagens/${plate.extra.municipio.uf.toUpperCase()}.png`)
      const oldPlate = await CanvasTemplates.oldPlate(plate.placa.replace(/(....)$/, '-$1'), `${plate.extra.municipio.uf} - ${plate.extra.municipio.municipio.toUpperCase()}`)
      const plateType = plate.extra.placa_nova !== 't' ? oldPlate : mercosulPlate
      // TODO: find a better car image api
      const carpic = await this.client.apis.gsearch.searchImage(`${plate.modelo} ${plate.anoModelo} webmotors`)
      const attach = new MessageAttachment(plateType, 'plate.png')
      channel.send(
        new SwitchbladeEmbed()
          .setDescription(`**${t('commands:searchplate.plate')}**: ${plate.placa}\n**${t('commands:searchplate.model')}**: ${plate.extra.marca_modelo.modelo}\n**${t('commands:searchplate.year')}**: ${plate.anoModelo}\n**${t('commands:searchplate.color')}**: ${plate.cor}\n**${t('commands:searchplate.type')}**: ${plate.extra.tipo_veiculo.tipo_veiculo} (${plate.extra.quantidade_passageiro} passengers)\n**${t('commands:searchplate.maxtorque')}**: ${plate.extra.potencia}bhp\n**${t('commands:searchplate.engineCapacity')}**: ${plate.extra.cilindradas}cc\n**${t('commands:searchplate.nationality')}**: ${plate.extra.nacionalidade.nacionalidade}\n**${t('commands:searchplate.fuelType')}**: ${plate.extra.combustivel.combustivel}\n**${t('commands:searchplate.city')}**: ${plate.extra.municipio.municipio} - ${plate.extra.municipio.uf}\n**${t('commands:searchplate.status')}**: ${(plate.situacao !== 'Roubo/Furto') ? t('commands:searchplate.notstolen') : `**${t('commands:searchplate.stolen')}**`}\n**${t('commands:searchplate.chassis')}**: ${cleanContent(plate.extra.chassi, message)}\n\n**${t('commands:searchplate.image')}**:`)
          .setImage((carpic.items[0] ? carpic.items[0].link : undefined) || 'https://i.imgur.com/awMCwj3.jpg')
          .setColor((plate.situacao !== 'Roubo/Furto') ? Constants.GUILD_ADDED_COLOR : Constants.GUILD_LOST_COLOR)
          .attachFiles(attach)
          .setThumbnail('attachment://plate.png')
      )
      channel.stopTyping(true)
    } catch (e) {
      channel.stopTyping(true)
      console.log(e)
      throw new CommandError(t('commands:searchplate.notFound'))
    }
  }
}
