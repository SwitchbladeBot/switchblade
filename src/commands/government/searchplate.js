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
        apis: ['consultaplaca', 'bingimages']
      },
      parameters: [{
        type: 'string',
        full: true,
        missingError: 'commands:searchplate.notFound'
      }]
    }, client)
  }

  async run ({ t, author, channel, message }, plt) {
    const plateRegex = /^[a-zA-Z]{3}[0-9]{4}$/
    try {
      const plate = await this.client.apis.consultaplaca.searchPlate(plt)
      const mercosulPlate = await CanvasTemplates.plateMercosul(plate.placa, `https://cdn.jsdelivr.net/gh/bgeneto/bandeiras-br/imagens/${plate.uf}.png`)
      const oldPlate = await CanvasTemplates.oldPlate(plate.placa.replace(/(....)$/, '-$1'), `${plate.uf} - ${plate.municipio.toUpperCase()}`)
      const plateType = plateRegex.test(plt) ? oldPlate : mercosulPlate
      const newpic = await this.client.apis.bingimages.searchImage(`${plate.anoModelo} ${plate.modelo.replace('I/', '')}`)
      console.log(newpic)
      const attach = new MessageAttachment(plateType, 'plate.png')
      const embed = new SwitchbladeEmbed()
      // i don't like if's gonna change it to something else
      if (plate.extra) {
        embed.setDescription(`**${t('commands:searchplate.plate')}**: ${plate.placa}\n**${t('commands:searchplate.model')}**: ${plate.extra.marca_modelo.modelo}\n**${t('commands:searchplate.year')}**: ${plate.anoModelo}\n**${t('commands:searchplate.color')}**: ${plate.cor}\n**${t('commands:searchplate.type')}**: ${plate.extra.tipo_veiculo.tipo_veiculo} (${plate.extra.quantidade_passageiro} passengers)\n**${t('commands:searchplate.maxtorque')}**: ${plate.extra.potencia}hp\n**${t('commands:searchplate.engineCapacity')}**: ${plate.extra.cilindradas}cc\n**${t('commands:searchplate.nationality')}**: ${plate.extra.nacionalidade.nacionalidade}\n**${t('commands:searchplate.fuelType')}**: ${plate.extra.combustivel.combustivel}\n**${t('commands:searchplate.city')}**: ${plate.extra.municipio.municipio} - ${plate.extra.municipio.uf}\n**${t('commands:searchplate.status')}**: ${(plate.situacao !== 'Roubo/Furto') ? t('commands:searchplate.notstolen') : `**${t('commands:searchplate.stolen')}**`}\n**${t('commands:searchplate.chassis')}**: ${cleanContent(plate.extra.chassi, message)}\n**${t('commands:searchplate.renavam')}**: ${plate.extra.renavam ? plate.extra.renavam : '00000000000'}\n\n**${t('commands:searchplate.image')}**:`)
      } else {
        embed.setDescription(`**${t('commands:searchplate.plate')}**: ${plate.placa}\n**${t('commands:searchplate.model')}**: ${plate.modelo}\n**${t('commands:searchplate.year')}**: ${plate.anoModelo}\n**${t('commands:searchplate.color')}**: ${plate.cor}\n**${t('commands:searchplate.city')}**: ${plate.municipio} - ${plate.uf}\n**${t('commands:searchplate.status')}**: ${(plate.situacao !== 'Roubo/Furto') ? t('commands:searchplate.notstolen') : `**${t('commands:searchplate.stolen')}**`}\n**${t('commands:searchplate.chassis')}**: ${cleanContent(plate.chassi, message)}\n\n**${t('commands:searchplate.image')}**:`)
      }
      embed.setImage(newpic || 'https://i.imgur.com/awMCwj3.jpg')
        .setColor((plate.situacao !== 'Roubo/Furto') ? Constants.GUILD_ADDED_COLOR : Constants.GUILD_LOST_COLOR)
        .attachFiles(attach)
        .setThumbnail('attachment://plate.png')
      channel.send(embed)
    } catch (e) {
      console.log(e)
      throw new CommandError(t('commands:searchplate.notFound'))
    }
  }
}
