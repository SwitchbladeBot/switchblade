const { CommandStructures, SwitchbladeEmbed, MiscUtils, Constants } = require('../../')
const { Command, CommandParameters, StringParameter } = CommandStructures
const gplay = require('google-play-scraper')

module.exports = class PlayStore extends Command {
  constructor (client) {
    super(client)
    this.name = 'playstore'
    this.aliases = ['googlestore']
    this.category = 'utility'
    this.parameters = new CommandParameters(this,
      new StringParameter({ missingError: 'commands:playstore.noCountryProvided' }),
      new StringParameter({ full: true, missingError: 'commands:playstore.noAppProvided' })
    )
  }
  run ({ t, author, channel }, country, appName) {
    channel.startTyping()
    gplay.search({ term: appName, country: country, num: 8 }).then((apps) => {
      const listEmbed = new SwitchbladeEmbed(author)
        .setTitle(t('commands:playstore.results', { appName }))
        .setDescription(`**${t('commands:playstore.sendYourNumber')}**\n\n\`[1]\` ${apps[0].title}\n\`[2]\` ${apps[1].title}\n\`[3]\` ${apps[2].title}\n\`[4]\` ${apps[3].title}\n\`[5]\` ${apps[4].title}\n\`[6]\` ${apps[5].title}\n\`[7]\` ${apps[6].title}\n\`[8]\` ${apps[7].title}`)
      channel.send(listEmbed).then(async (msg) => {
        channel.stopTyping()
        let col = await channel.awaitMessages(m => m.author.id === author.id, { max: 1, time: 120000 })
        const embed = new SwitchbladeEmbed(author)
        let app = apps[col.first().content - 1]
        if (!app) {
          await msg.delete()
          embed
            .setColor(Constants.ERROR_COLOR)
            .setTitle(t('commands:playstore.invalidNumber'))
          return channel.send(embed)
        }
        embed
          .setTitle(app.title)
          .setURL(app.url)
          .setThumbnail(`https:${app.icon}`)
          .addField(t('commands:playstore.score'), MiscUtils.ratingToStarEmoji(app.score), true)
          .addField(t('commands:playstore.developer'), app.developer, true)
          .setDescription(app.summary)
          .addField(t('commands:playstore.price'), app.free ? t('commands:playstore.free') : app.priceText, true)
        msg.delete()
        channel.send(embed)
      })
    })
  }
}
