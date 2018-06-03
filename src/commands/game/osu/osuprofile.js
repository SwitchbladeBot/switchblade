const { Command, SwitchbladeEmbed, OsuUtils } = require('../../../index')
const logo = 'https://vignette2.wikia.nocookie.net/fantendo/images/1/12/Osu%21_logo.png'

module.exports = class OsuProfile extends Command {
  constructor (client) {
    super(client)
    this.name = 'osuprofile'
    this.aliases = ['osup', 'osu']
  }

  canLoad () {
    return !!this.client.apis.osu
  }

  async run (message, args) {
    const embed = new SwitchbladeEmbed(message.author)
    if (args.length >= 2) { // Check if enough args were passed
      if (OsuUtils.modes.indexOf(args[0]) > -1) { // Check if the first argument is a valid gamemode
        message.channel.startTyping()
        const user = await this.client.apis.osu.user.get(args.slice(0, args.length), OsuUtils.modes.indexOf(args[0]))
        if (user) {
          embed.setAuthor('osu!' + (args[0] !== 'osu' ? args[0] : ''), logo)
          if (user.playcount !== null) { // Check if the API returned null values
            const nf = new Intl.NumberFormat('en-US')
            console.log(user)
            embed
              .setColor(this.client.colors.osu)
              .setThumbnail('https://a.ppy.sh/' + user.user_id)
              .setDescription(`**[${user.username}](https://osu.ppy.sh/users/${user.user_id})** (${user.user_id})\n<:osu_ssplus:449278160249290752> ${user.count_rank_ssh} <:osu_ss:449278160198959114> ${user.count_rank_ss} <:osu_splus:449278160354279444> ${user.count_rank_sh} <:osu_s:449278159792373763> ${user.count_rank_s} <:osu_a:449278160123723776> ${user.count_rank_a}`)
              .addField('Global Ranking', `#${nf.format(user.pp_rank)}${user.pp_rank <= 10 ? ' :trophy:' : ''}`, true)
              .addField('Country Ranking', `:flag_${user.country.toLowerCase()}: #${nf.format(user.pp_country_rank)}`, true)
              .addField('Performance', nf.format(Math.floor(user.pp_raw)) + 'pp', true)
              .addField('Hit Accuracy', nf.format(parseFloat(user.accuracy).toFixed(2)) + '%', true)
              .addField('Total Score', nf.format(user.total_score), true)
              .addField('Ranked Score', nf.format(user.ranked_score), true)
              .addField('Play Count', user.playcount, true)
              .addField('Level', Math.floor(user.level), true)
          } else { // API returned null values
            embed
              .setColor(this.client.colors.osu)
              .setDescription(`This user hasn't played \`${args[0]}\` yet.`)
          }
        } else { // Osu API returned undefined
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
        .setDescription(`**Usage:** \`${process.env.PREFIX}${this.name} <username>\``)
    }
    message.channel.send(embed)
    message.channel.stopTyping()
  }
}
