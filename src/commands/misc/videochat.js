const { Command } = require('../../')

module.exports = class VideoChat extends Command {
  constructor (client) {
    super(client, {
      name: 'videochat',
      requirements: {
        guildOnly: true,
        voiceChannelOnly: true
      }
    })
  }

  run ({ t, channel, guild, voiceChannel }) {
    channel.send(`${t('commands:videochat.text', { channelName: voiceChannel.name })}\n<https://canary.discordapp.com/channels/${guild.id}/${voiceChannel.id}>`)
  }
}
