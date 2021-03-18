const { SearchCommand, SwitchbladeEmbed, Constants } = require('../../')

module.exports = class Kabum extends SearchCommand {
  constructor (client) {
    super({
      name: 'kabum',
      embedColor: Constants.KABUM_COLOR,
      embedLogoURL: 'https://www.kabum.com.br/hotsite/app/img/icone-app2.png'
    }, client)
  }

  async search (_, query) {
    const result = await this.client.apis.kabum.getSuggestion(query)
    return result || []
  }

  searchResultFormatter (items) {
    return `${items.nome} - ${items.nome_fabricante}`
  }

  async handleResult ({ t, channel, author, language }, { codigo }) {
    const product = await this.client.apis.kabum.getProduct(codigo)
    channel.send(
      new SwitchbladeEmbed(author)
        .setColor(this.embedColor)
        .setThumbnail(product.fabricante.img)
        .setDescription(`[**${product.nome}**](https://kabum.com.br${product.link_descricao})\n\n**${t('commands:kabum.manufacter')}**: ${product.fabricante.nome}\n**${t('commands:kabum.price')}**: R$${product.preco.toFixed(2)} (R$${product.preco_desconto.toFixed(2)} ${t('commands:kabum.withDiscount')})\n**${t('commands:kabum.availability')}**: ${product.disponibilidade ? t('commons:yes') : t('commons:no')}\n**${t('commands:kabum.weight')}**: ${product.dimensao_peso} ${t('commons:grams')}\n**${t('commands:kabum.warrant')}**: ${product.garantia.match(/\d+/)} ${t('commands.kabum:year')}`)
        .setImage(product.fotos[0])
    )
  }
}
