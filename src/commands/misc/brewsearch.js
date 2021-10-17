const { Command, CommandError, SwitchbladeEmbed, Constants } = require('../../')

module.exports = class BrewSearch extends Command {
  constructor (client) {
    super({
      name: 'brew',
      parameters: [
        {
          type: 'string',
          // TODO: Add Missing Command
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
          .setDescription(
            t('commands:brew.description', { description: formulaeData.data.desc }) +
            t('commands:brew.analytics', {
              '30d': formulaeData.data.analytics.install['30d'][formulaeData.data.name],
              '90d': formulaeData.data.analytics.install['90d'][formulaeData.data.name],
              '365d': formulaeData.data.analytics.install['365d'][formulaeData.data.name]
            }) +
            t('commands:brew.downloadLink', {
              brew_link: `https://formulae.brew.sh/formula/${formulaeData.data.name}`,
              home_page: formulaeData.data.homepage
            }))
          .setColor(Constants.HOMEBREW_COLOR)
      )
    } catch (e) {
      throw new CommandError(t('commands:brew.invalidFormulae'))
    }
  }
}
