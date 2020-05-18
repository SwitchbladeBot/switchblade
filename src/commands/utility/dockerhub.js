const { SearchCommand, SwitchbladeEmbed, MiscUtils } = require('../../')

const DOCKERHUB_COLOR = '#009ddc'
const DOCKERHUB_ICON = 'https://d1q6f0aelx0por.cloudfront.net/icons/docker-edition-azure6.png'

module.exports = class DockerHub extends SearchCommand {
  constructor (client) {
    super({
      name: 'dockerhub',
      aliases: ['docker'],
      category: 'utility',
      parameters: [{
        type: 'string',
        full: true,
        missingError: 'commands:dockerhub.noNameProvided'
      }],
      embedColor: DOCKERHUB_COLOR,
      embedLogoURL: DOCKERHUB_ICON
    }, client)
  }

  async search (context, query) {
    return this.client.apis.dockerhub.search(query)
  }

  searchResultFormatter (repository) {
    return `[${repository.name}](${this.client.apis.dockerhub.getRepositoryUrl(repository)})`
  }

  async handleResult ({ t, channel, author, language }, repository) {
    channel.send(
      new SwitchbladeEmbed(author)
        .setAuthor('Docker Hub', DOCKERHUB_ICON)
        .setColor(DOCKERHUB_COLOR)
        .setDescriptionFromBlockArray([
          [
            `**[${repository.name}](${this.client.apis.dockerhub.getRepositoryUrl(repository)})**`,
            repository.short_description
          ]
        ])
        .setThumbnail(repository.logo_url.large)
    )
  }
}
