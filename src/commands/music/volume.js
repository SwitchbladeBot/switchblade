const { Command, CommandRequirements, Constants, SwitchbladeEmbed } = require('../../')

module.exports = class Volume extends Command {
  constructor (client) {
    super(client)
    this.name = 'volume'
    this.aliases = ['vol']

    this.requirements = new CommandRequirements(this, {guildOnly: true, voiceChannelOnly: true, guildPlaying: true})
  }

  async run (message, args) {
    const embed = new SwitchbladeEmbed(message.author)
    const guildPlayer = this.client.playerManager.get(message.guild.id)

    if (args.length > 0) {
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
        .setTitle('You need to give me the volume level!')
        .setDescription(`**Usage:** \`${process.env.PREFIX}${this.name} <0-150>\``)
    }

    message.channel.send(embed)
  }
}
