const { Command, CommandError, SwitchbladeEmbed, Constants } = require('../../')

module.exports = class BrewSearch extends Command {
  constructor (client) {
    super({
      name: 'brew',
      parameters: [
        {
          type: 'string',
          missingError: 'commands:brew.missingFormulae'
        }
      ],
      requirements: {
        apis: ['brew']
      }
    }, client)
  }

  async run ({ t, author, channel }, formulae) {
    try {
      const formulaeData = await this.client.apis.brew.search(formulae)
      channel.send(
        new SwitchbladeEmbed(author)
          .setTitle(t('commands:brew.title', { name: formulaeData.data.full_name }))
          .setDescriptionFromBlockArray([
            [
              `**${t('commands:brew.description')}**: ${formulaeData.data.desc}`,
              `**${t('commands:brew.analytics')}**:\n${t('commands:brew.30d')}: \`${
                formulaeData.data.analytics.install['30d'][formulaeData.data.name]
              }\`\n${t('commands:brew.90d')}: \`${
                formulaeData.data.analytics.install['90d'][formulaeData.data.name]
              }\`\n${t('commands:brew.365d')}: ${
                formulaeData.data.analytics.install['365d'][formulaeData.data.name]
              }`,
              `**${t('commands:brew.links')}**:\n[${t(
                'commands:brew.homebrewLink'
              )}](https://formulae.brew.sh/formula/${formulaeData.data.name}) [${t(
                'commands:brew.homePage'
              )}](${formulaeData.data.homepage})`
            ]
          ])
          .setColor(Constants.HOMEBREW_COLOR)
      )
    } catch {
      throw new CommandError(t('commands:brew.invalidFormulae'))
    }
  }
}
