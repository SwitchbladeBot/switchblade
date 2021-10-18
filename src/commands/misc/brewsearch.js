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
          .setTitle(t('commands:brew.title', { name: formulaeData.full_name }))
          .setDescriptionFromBlockArray([
            [
              `**${t('commands:brew.description')}**: ${formulaeData.desc}`,
              `**${t('commands:brew.analytics')}**:\n${t('commands:brew.30d')}: \`${
                formulaeData.analytics.install['30d'][formulaeData.name]
              }\`\n${t('commands:brew.90d')}: \`${
                formulaeData.analytics.install['90d'][formulaeData.name]
              }\`\n${t('commands:brew.365d')}: ${
                formulaeData.analytics.install['365d'][formulaeData.name]
              }`,
              `**${t('commands:brew.links')}**:\n[${t(
                'commands:brew.homebrewLink'
              )}](https://formulae.brew.sh/formula/${formulaeData.name}) [${t(
                'commands:brew.homePage'
              )}](${formulaeData.homepage})`
            ]
          ])
          .setColor(Constants.HOMEBREW_COLOR)
      )
    } catch {
      throw new CommandError(t('commands:brew.invalidFormulae'))
    }
  }
}
