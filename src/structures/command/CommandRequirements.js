const Constants = require('../../utils/Constants.js')
const SwitchbladeEmbed = require('../SwitchbladeEmbed.js')

module.exports = class CommandRequirements {
  constructor (command, options = {}) {
    this.command = command
    this.cooldownMap = new Map()

    this.permissions = options.permissions || []
    this.cooldown = Object.assign({enabled: false, feedback: true, time: 1}, options.cooldown)
    this.guildOnly = !!options.guildOnly
    this.voiceChannelOnly = !!options.voiceChannelOnly
    this.guildPlaying = !!options.guildPlaying
  }

  handle (message, args) {
    const error = this.errorMessageFactory(message)

    if (this.guildOnly && !message.guild) {
      message.channel.send('guildOnly')
      return false
    }

    if (this.voiceChannelOnly && !message.member.voiceChannel) {
      error('You need to be in a voice channel to use this command!')
      return false
    }

    const guildPlayer = this.command.client.playerManager.get(message.guild.id)
    if (this.guildPlaying && (!guildPlayer || !guildPlayer.playing)) {
      error('I ain\'t playing anything!')
      return false
    }

    if (this.permissions.length > 0) {
      if (!message.channel.permissionsFor(message.member).has(this.permissions)) {
        error(this.permissions.join(', '))
        return false
      }
    }

    if (this.cooldown.enabled && this.cooldownMap.has(message.author.id)) {
      if (this.cooldown.feedback) {
        error('Woah! Slow down buddy! You\'re going too fast, you need to wait!')
      }
      return false
    }

    return true
  }

  applyCooldown (user, time) {
    if (!user || !this.cooldown.enabled) return false
    time = time || this.cooldown.time

    if (!this.cooldownMap.has(user.id)) {
      this.cooldownMap.set(user.id, Date.now())
      user.client.setTimeout(() => {
        this.cooldownMap.delete(user.id)
      }, time * 1000)
    }
  }

  errorMessageFactory (message) {
    return (title, showUsage, customize) => {
      customize = customize || ((e) => e)
      const embed = new SwitchbladeEmbed(message.author)
        .setColor(Constants.ERROR_COLOR)
        .setTitle(title)
      if (showUsage) {
        const params = this.parameters.map(p => '<' + p.id + '>').join(' ')
        embed.setDescription(`**Usage:** \`${process.env.PREFIX}${this.command.name} ${params}\``)
      }
      return message.channel.send(customize(embed))
        .then(() => message.channel.stopTyping())
    }
  }
}
