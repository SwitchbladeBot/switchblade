const { Command, CommandError, SwitchbladeEmbed, Constants } = require('../../')
const moment = require('moment')

module.exports = class AuxilioEmergencial extends Command {
  constructor (client) {
    super({
      name: 'auxilioemergencial',
      alias: ['aemergencial', 'ae'],
      category: 'government',
      requirements: {
        apis: ['portaldatransparencia']
      },
      parameters: [{
        type: 'string',
        full: true,
        missingError: 'commands:auxilioemergencial.notFound'
      }]
    }, client)
  }

  async run ({ t, author, channel, language }, cpf) {
    const auxilio = await this.client.apis.portaldatransparencia.searchAuxilioCPF(cpf)
    moment.locale(language)
    try {
      channel.send(
        new SwitchbladeEmbed(author)
          .setAuthor('Portal da Transparência', 'https://logodownload.org/wp-content/uploads/2017/03/brasao-do-brasil-republica-1.png', 'http://portaltransparencia.gov.br/')
          .setColor(Constants.PORTALTRANSPARENCIA_COLOR)
          .setDescription(`**${t('commands:auxilioemergencial.name')}**: ${auxilio[0].beneficiario.nome}\n**${t('commands:auxilioemergencial.cpf')}**:` + auxilio[0].beneficiario.cpfFormatado + `\n**${t('commands:auxilioemergencial.nis')}**: ${auxilio[0].beneficiario.nis}\n**${t('commands:auxilioemergencial.amount')}**: R$ ${auxilio[0].valor}.00\n**${t('commands:auxilioemergencial.city')}**: ${auxilio[0].municipio.nomeIBGE} - ${auxilio[0].municipio.uf.sigla}`)
      )
    } catch (e) {
      channel.stopTyping(true)
      throw new CommandError(t('commands:correios.notFound'))
    }
  }
}
