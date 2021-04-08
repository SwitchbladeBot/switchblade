const { Command, CommandError, SwitchbladeEmbed } = require('../../')

module.exports = class CEP extends Command {
  constructor (client) {
    super({
      name: 'cep',
      alias: ['searchCEP'],
      category: 'utility',
      requirements: {
        apis: ['viacep']
      },
      parameters: [{
        type: 'string',
        full: true,
        missingError: 'commands:cep.nocep'
      }]
    }, client)
  }

  async run ({ t, author, channel }, cep) {
    channel.startTyping()
    try {
      const rcep = await this.client.apis.viacep.searchCEP(cep)
      channel.send(
        new SwitchbladeEmbed()
          .setDescription(`**${t('commands:cep.cep')}**: ${rcep.cep}\n**${t('commands:cep.fullAddress')}**: ${rcep.logradouro} ${rcep.complemento}\n**${t('commands:cep.neighborhood')}**: ${rcep.bairro}\n**${t('commands:cep.city')}**: ${rcep.localidade} - ${rcep.uf}\n**${t('commands:cep.ibge')}**: ${rcep.ibge}`)
          .setThumbnail(`https://cdn.jsdelivr.net/gh/bgeneto/bandeiras-br/imagens/${rcep.uf}.png`)
      )
      channel.stopTyping(true)
    } catch (e) {
      channel.stopTyping(true)
      throw new CommandError(`${t('commands:cep.notFound')}`)
    }
  }
}
