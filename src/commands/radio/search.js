const { SearchCommand, CommandError, SwitchbladeEmbed } = require('../../')

module.exports = class TuneIn extends SearchCommand {
  constructor (client) {
    super(client, {
      name: 'tunein',
      category: 'radio',
      parameters: [
        {
          type: 'string',
          full: true
        }
      ],
      requirements: { apis: ['tunein'] }
    })
  }

  async search (_context, keyword) {
    const results = await this.client.apis.tunein.search(keyword)
    return results
  }

  searchResultFormatter (radio) {
    return `${this.formatTitle(radio.text)}`
  }

  async handleResult ({ t, channel, author, language }, radio) {
    this.getRadioDescription(radio.now_playing_id)
      .then(r => {
        const song = r.current_song ? `${r.current_artist} - ${r.current_song}` : 'N/A'
        channel.send(
          new SwitchbladeEmbed(author)
            .setTitle(this.formatTitle(r.title || r.name))
            .addField('Now Playing:', song, true)
            .addField('Genre:', r.genre_name, true)
            .setThumbnail(r.logo)
            .setDescription(r.description)
            .setURL(r.detail_url)
        )
      })
      .catch(e => {
        throw new CommandError(t('errors:generic'))
      })
  }

  async getRadioDescription (id) {
    const result = await this.client.apis.tunein.describeRadio(id)
    return result
  }

  formatTitle (title) {
    return !title.toLowerCase().includes('radio') ? `${title} Radio` : title
  }
}
