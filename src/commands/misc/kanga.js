const { SwitchbladeEmbed, Command } = require('../../')

module.exports = class KangaCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'kanga',
      parameters: [
        {
          type: 'string',
          full: true,
          clean: true
        }
      ],
      requirements: { apis: ['kanga'] }
    })
  }

  async run ({ t, author, channel, language }, query) {
    channel.startTyping()
    const response = await this.client.apis.kanga.search(query)
    channel.send(
      new SwitchbladeEmbed(author)
        .setColor(0xf1592b)
        .setAuthor(
          'Kanga',
          'https://assets-global.website-files.com/5ce578d88cd2e943b4e0f32b/5cec145338469c476baee9a8_kanga_favicon.png',
          `http://kanga.gg/${process.env.KANGA_REFERRAL_CODE ? `app/inv?r=FocusedWolverineSejuani` : ''}`
        )
        .setDescriptionFromBlockArray(response.map(({ metaData, gameData, streamerData }) => {
          return [
            `**${streamerData.displayName}** \`${metaData.language}\``,
            `[${metaData.streamTitle}](http://twitch.tv/${streamerData.streamerUsername})`
          ]
        }))
    ).then(() => channel.stopTyping())
  }
}
