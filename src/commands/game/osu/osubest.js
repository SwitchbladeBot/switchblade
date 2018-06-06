const { Command, SwitchbladeEmbed, OsuUtils } = require('../../../index')
const logo = 'https://vignette2.wikia.nocookie.net/fantendo/images/1/12/Osu%21_logo.png'

module.exports = class OsuBest extends Command {
  constructor (client) {
    super(client)
    this.name = 'osubest'
    this.aliases = ['osub', 'osutop']
  }

  canLoad () {
    return !!this.client.apis.osu
  }

  async run (message, args) {
    const embed = new SwitchbladeEmbed(message.author)
    if (args.length >= 2) { // Check if enough args were passed
      const mode = args[0].toLowerCase()
      if (OsuUtils.modes.includes(mode)) { // Check if the first argument is a valid gamemode
        message.channel.startTyping()
        const user = await this.client.apis.osu.user.get(args.slice(0, args.length), OsuUtils.modes.indexOf(mode))
        if (user) {
          const scores = await this.client.apis.osu.user.getBest(user.user_id, OsuUtils.modes.indexOf(mode))
          if (scores.length > 0) {
            const scoresText = await Promise.all(scores.map(async score => {
              const [ beatmap ] = await this.client.apis.osu.beatmaps.getByBeatmapId(score.beatmap_id)
              return `[**${beatmap.artist} - ${beatmap.title}**](https://osu.ppy.sh/beatmapsets/${beatmap.beatmapset_id}) [${beatmap.version}]\n**${Math.round(score.pp)}pp** - ${OsuUtils.calculateAccuracy(score, mode)}%`
              // TODO - Add more information about each track
            }))
            embed
              .setAuthor('osu!' + (mode !== 'osu' ? mode : '') + ` - ${user.username}'s top ranks`, logo)
              .setColor(this.client.colors.osu)
              .setDescription(scoresText.join('\n\n'))
          } else { // osu! API returned undefined
            embed
              .setColor(this.client.colors.error)
              .setTitle(`I couldn't find any osu!${mode} top ranks for ${user.username}.`)
          }
        } else { // osu! API returned undefined
          embed
            .setColor(this.client.colors.error)
            .setTitle('I couldn\'t find a user with that name')
        }
      } else { // First argument isn't a valid gamemode
        embed
          .setColor(this.client.colors.error)
          .setTitle(`"${args[0]}" isn't a valid gamemode.`)
          .setDescription(`**Valid gamemodes:** ${OsuUtils.modes.map(g => `\`${g}\``).join(', ')}\n**Usage:** \`${process.env.PREFIX}${this.name} <gamemode> <username>\``)
      }
    } else { // No args were passed
      embed
        .setColor(this.client.colors.error)
        .setTitle('You need to give me a gamemode and a username')
        .setDescription(`**Usage:** \`${process.env.PREFIX}${this.name} <gamemode> <username>\``)
    }
    message.channel.send(embed)
    message.channel.stopTyping()
  }
}
