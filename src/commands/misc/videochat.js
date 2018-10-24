const { CommandStructures } = require('../../')
const { Command, CommandRequirements } = CommandStructures

module.exports = class VideoChat extends Command {
  constructor (client) {
    super(client)
    this.name = 'videochat'
    this.requirements = new CommandRequirements(this, {guildOnly: true, voiceChannelOnly: true})
  }

  run ({ channel, guild, voiceChannel }) {
    channel.send(`**Click on this link to join the video chat:** \`(You must already be in ${voiceChannel.name})\`\n<https://canary.discordapp.com/channels/${guild.id}/${voiceChannel.id}>`)
  }
}
