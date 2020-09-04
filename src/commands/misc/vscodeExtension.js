const { SearchCommand, SwitchbladeEmbed, Constants } = require('../../')

module.exports = class VSCodeExtensions extends SearchCommand {
  constructor (client) {
    super({
      name: 'vscodeextensions',
      aliases: ['codeextensions', 'codeext'],
      requirements: { apis: ['vscodeextensions'] },
      parameters: [{
        type: 'string',
        full: true,
        missingError: 'commons:search.noParams'
      }],
      embedColor: Constants.VSCODE_EXTENSIONS_COLOR,
      embedLogoURL: 'https://i.imgur.com/qB28xlw.png'
    }, client)
  }

  async run ({ t, author, channel }, query) {
    const embed = new SwitchbladeEmbed(author)
    const res = await this.client.apis.vscodeextensions.search(query)
    console.log(res)
    embed.addField(t('commands:vscodeExtensions.name'), res.results[0].extensions[0].displayName)
    channel.send(embed)
  }
}
