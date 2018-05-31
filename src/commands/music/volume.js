const { Command, SwitchbladeEmbed, Constants } = require('../../')

module.exports = class Volume extends Command {
  constructor (client) {
    super(client)
    this.name = 'volume'
    this.aliases = ['vol']
  }

  async run (message, args) {
    const embed = new SwitchbladeEmbed(message.author)

    if (args.length > 0) {
      if (message.member.voiceChannel) {
        const playerManager = this.client.playerManager
        const guildPlayer = playerManager.get(message.guild.id)
        if (guildPlayer && guildPlayer.playing) {
          const volume = Math.max(Math.min(parseInt(args[0]), 150), 0)
          if (!isNaN(volume)) {
            guildPlayer.volume(volume)
            embed
              .setTitle(`\uD83D\uDD0A Volume set to ${volume}.`)
          } else {
            embed
              .setColor(Constants.ERROR_COLOR)
              .setTitle('You need to give me a valid number!')
          }
        } else {
          embed
            .setColor(Constants.ERROR_COLOR)
            .setTitle('I ain\'t playing anything!')
        }
      } else {
        embed
          .setColor(Constants.ERROR_COLOR)
          .setTitle('You need to be in a voice channel to use this command!')
      }
    } else {
      embed
        .setColor(Constants.ERROR_COLOR)
        .setTitle('You need to give me the volume level!')
        .setDescription(`**Usage:** \`${process.env.PREFIX}${this.name} <0-150>\``)
    }

    message.channel.send(embed)
  }

  canRun (message, args) {
    return !!message.guild && super.canRun(message, args)
  }
}
