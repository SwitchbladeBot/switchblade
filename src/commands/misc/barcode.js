const { Command, CommandError, SwitchbladeEmbed, Constants } = require('../../')

module.exports = class UPCBarcode extends Command {
  constructor (client) {
    super({
      name: 'barcode',
      aliases: ['upc', 'upcbarcode', 'upcbarc'],
      category: 'misc',
      requirements: {
        apis: [ 'barcode' ]
      },
      parameters: [{
        type: 'string',
        full: true,
        missingError: 'commands:barcode.noCode'
      }]
    }, client)
  }

  async run ({ t, channel }, code) {
    channel.startTyping()
    try {
      const { data } = await this.client.apis.barcode.request(code)
      const embed = new SwitchbladeEmbed()
        .setTitle(data.title)
        .setColor(Constants.BARCODE_COLOR)
        .setFooter(
          t('commands:barcode.footer'),
          'https://upcdatabase.org/images/logo.png'
        )
      if (data.description !== '') embed.setDescription(`/${data.description}/`)
      if (data.images) embed.setThumbnail(data.images[0])
      if (data.stores) {
        embed.addFields(
          data.stores.map(d =>
            ({
              name: d.store,
              price: `${d.price ? `$${d.price}` : ''}`
            })
          )
        )
      }
      channel.send(embed).then(() => channel.stopTyping())
    } catch (err) {
      channel.stopTyping()
      if (err.response && err.response.status === 404) {
        throw new CommandError(t('commands:barcode.notFound'))
      } else {
        throw new CommandError(t('commands:barcode.error'))
      }
    }
  }
}
