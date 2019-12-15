const { Command } = require('../../')

module.exports = class VideoChat extends Command {
  constructor (client) {
    super({
      name: 'videochat',
      requirements: {
        guildOnly: true,
        voiceChannelOnly: true
      }
    }, client)
  }

  run ({ t, channel, guild, voiceChannel }) {
    channel.send(`${t('commands:videochat.text', { channelName: voiceChannel.name })}\n<https://canary.discordapp.com/channels/${guild.id}/${voiceChannel.id}>`)
  }
}
