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
      const plateType = plateRegex.test(plt)
        ? await CanvasTemplates.oldPlate(plate.placa.replace(/(....)$/, '-$1'), `${plate.uf || plate.uf_placa} - ${plate.municipio.toUpperCase()}`)
        : await CanvasTemplates.plateMercosul(plate.placa, `https://cdn.jsdelivr.net/gh/bgeneto/bandeiras-br/imagens/${plate.uf || plate.uf_placa}.png`)
      const newpic = await this.client.apis.bingimages.searchImage(`${plate.anoModelo} ${(plate.modelo.replace('I/', ''))}`)
      const attach = new MessageAttachment(plateType, 'plate.png')
      const embed = new SwitchbladeEmbed()
      // i don't like if's gonna change it to something else
      if (plate.extra) {
        const vinDecoder = /^([A-Z0-9]){17}$/.test(plate.extra.chassi)
          ? await this.client.apis.vindecoder.getVIN(plate.extra.chassi)
          : null
        const cnpj = plate.extra.faturado
          ? await this.client.apis.cnpj.getCNPJ(plate.extra.faturado)
          : undefined
        embed.setTitle((vinDecoder && plate.extra.marca_modelo.modelo === plate.extra.marca_modelo.marca) ? `${plate.extra.marca_modelo.modelo} ${vinDecoder?.Results[8].Value} - ${plate.anoModelo}` : `${plate.extra.marca_modelo.modelo ? plate.extra.marca_modelo.modelo.replace(/(IMP*){3}\//, '') : plate.modelo.replace(/(IMP*){3}\//, '')} - ${plate.anoModelo}`)
          .addField(t('commands:searchplate.vinNumber'), cleanContent(plate.extra.chassi, message))
          .addField(t('commands:searchplate.city'), `${plate.extra.municipio.municipio} - ${plate.extra.municipio.uf}`)
          .addField(t('commands:searchplate:type'), `${(plate.extra.tipo_veiculo.tipo_veiculo === 'Nao Identificado' && vinDecoder?.Results[13].Value ? vinDecoder?.Results[13].Value : plate.extra.tipo_veiculo.tipo_veiculo)} (${plate.extra.quantidade_passageiro} ${t('commands:searchplate:passengers')})`, true)
          .addField(t('commands:searchplate.color'), plate.cor, true)
          .addField(t('commands:searchplate.nationality'), (plate.extra.nacionalidade.nacionalidade === 'Nacional' ? t('commands:searchplate.national') : `${t('commands:searchplate.imported')} (${(vinDecoder?.Results[14].Value || 'Unknown')})`), true)
          .addField(t('commands:searchplate.fuelType'), (plate.extra.combustivel.combustivel === 'Indeterminado' && vinDecoder?.Results[75].Value ? vinDecoder?.Results[75].Value : plate.extra.combustivel.combustivel), true)
          .addField(t('commands:searchplate.status'), (plate.situacao !== 'Roubo/Furto') ? t('commands:searchplate.notstolen') : t('commands:searchplate.stolen'), true)
          .addField(t('commands:searchplate.engine'), `${vinDecoder?.Results[71].Value ? Math.round(vinDecoder?.Results[71].Value * 100) / 100 : '0'}L ${(vinDecoder?.Results[70].Value ? Math.round(vinDecoder?.Results[70].Value) : plate.extra.potencia)}hp (${(plate.extra.cilindradas === '0' && vinDecoder?.Results[69].Value ? Math.round(vinDecoder?.Results[69].Value) : plate.extra.cilindradas)}cc)`, true)
          .addField(t('commands:searchplate.engineNumber'), (plate.extra.motor || '0000000000'), true)
          .addField(t('commands:searchplate.renavam'), plate.extra.renavam ? plate.extra.renavam : t('commands:searchplate.unknown'), true)
          .addField(t('commands:searchplate.vendor'), `[${(cnpj?.nome || t('commands:searchplate.unknown'))}](${plate.extra?.faturado.length === 14 ? `https://cnpjs.rocks/cnpj/${plate.extra.faturado}/` : ''})`, true)
      } else {
        embed.setDescription(`**${t('commands:searchplate.plate')}**: ${plate.placa}\n**${t('commands:searchplate.model')}**: ${plate.modelo}\n**${t('commands:searchplate.year')}**: ${plate.anoModelo}\n**${t('commands:searchplate.color')}**: ${plate.cor}\n**${t('commands:searchplate.city')}**: ${plate.municipio} - ${plate.uf}\n**${t('commands:searchplate.status')}**: ${(plate.situacao !== 'Roubo/Furto') ? t('commands:searchplate.notstolen') : `**${t('commands:searchplate.stolen')}**`}\n**${t('commands:searchplate.chassis')}**: ${cleanContent(plate.chassi, message)}\n\n**${t('commands:searchplate.image')}**:`)
      }
      embed.setImage(newpic || 'https://i.imgur.com/awMCwj3.jpg')
        .setColor((plate.situacao !== 'Roubo/Furto') ? Constants.GUILD_ADDED_COLOR : Constants.GUILD_LOST_COLOR)
        .attachFiles(attach)
        .setThumbnail('attachment://plate.png')
      channel.send(embed)
    } catch (e) {
      throw new CommandError(t('commands:searchplate.notFound'))
    }
  }
}
