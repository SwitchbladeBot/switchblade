const { Command, CommandError, SwitchbladeEmbed, Constants, CanvasTemplates } = require('../../')
const { cleanContent } = require('discord.js').Util
const { MessageAttachment } = require('discord.js')

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
    const plate = await this.client.apis.consultaplaca.searchPlate(plt)
    try {
      // vv  i know that's actually hardcoded :hahaa:
      const carpic = await this.client.apis.gsearch.searchImage(`${plate.extra.marca_modelo.marca} ${plate.extra.marca_modelo.grupo} ${plate.anoModelo} icarros`).then(res => res)
      console.log(carpic)
      const mercoSul = await CanvasTemplates.plateMercosul(plate.placa, `https://cdn.jsdelivr.net/gh/bgeneto/bandeiras-br/imagens/${plate.uf.toUpperCase()}.png`)
      const attach = new MessageAttachment(mercoSul, 'mercosul.png')
      channel.send(
        new SwitchbladeEmbed()
          .setDescription(`**${t('commands:searchplate.plate')}**: ${plate.placa}\n**${t('commands:searchplate.model')}**: ${plate.extra.marca_modelo.modelo}\n**${t('commands:searchplate.year')}**: ${plate.anoModelo}\n**${t('commands:searchplate.color')}**: ${plate.cor}\n**${t('commands:searchplate.type')}**: ${plate.extra.tipo_veiculo.tipo_veiculo} (${plate.extra.quantidade_passageiro} passengers)\n**${t('commands:searchplate.maxtorque')}**: ${plate.extra.potencia}bhp\n**${t('commands:searchplate.engineCapacity')}**: ${plate.extra.cilindradas}cc\n**${t('commands:searchplate.nationality')}**: ${plate.extra.nacionalidade.nacionalidade}\n**${t('commands:searchplate.fuelType')}**: ${plate.extra.combustivel.combustivel}\n**${t('commands:searchplate.city')}**: ${plate.municipio} - ${plate.uf}\n**${t('commands:searchplate.status')}**: ${(plate.situacao !== 'Roubo/Furto') ? t('commands:searchplate.notstolen') : `**${t('commands:searchplate.stolen')}**`}\n**${t('commands:searchplate.chassis')}**: ${cleanContent(plate.extra.chassi, message)}\n\n**${t('commands:searchplate.image')}**:`)
          .setImage('https://i.imgur.com/awMCwj3.jpg')
          .setColor((plate.situacao !== 'Roubo/Furto') ? Constants.GUILD_ADDED_COLOR : Constants.GUILD_LOST_COLOR)
          .attachFiles(attach)
          .setThumbnail('attachment://mercosul.png')
      )
      channel.stopTyping(true)
    } catch (e) {
      channel.stopTyping(true)
      console.log(e)
      throw new CommandError(t('commands:searchplate.notFound'))
    }
  }
}
