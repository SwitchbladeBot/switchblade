const { MessageEmbed, MessageAttachment } = require('discord.js')

module.exports = class CommandContext {
  /**
   * @param {Object} options The context options
   * @prop {Switchblade} client The SwitchBlade client
   * @prop {Message} message The command message
   * @prop {User} user The author of the message
   * @prop {?GuildMember} member The author of the message as a guild member
   * @prop {TextChannel} channel The channel of the message
   * @prop {?VoiceState} voiceState The voice state of the author of the message, if any
   * @prop {?Guild} guild The guild of the channel of the message
   * @prop {string} language The language used
   * @prop {Command} command The command
   * @prop {string} aliase
   * @prop {string} prefix The command prefix
   * @prop {Object} flags
   */
  constructor (options = {}) {
    this.client = options.client

    this.interaction = options.interaction
    this.author = options.interaction.user
    this.member = options.interaction.member
    this.channel = options.interaction.channel
    this.voiceState = this.member ? this.member.voice : null
    this.guild = options.interaction.guild
    this.language = options.language
    this.command = options.command
    this.prefix = '/'

    this.t = () => { throw new Error('Invalid FixedT') }
    this.flags = {}
    this.patchChannel()
    this.__replied = false
    this.__deferred = false

    setTimeout(async () => {
      if (!this.__replied) {
        await this.interaction.deferReply()
        this.__deferred = true
      }
    }, 1500)
  }

  reply (content, data = {}) {
    let request
    if (data.code) {
      request = { content: `\`\`\`${data.code}\n${content}\n\`\`\`` }
    } else if (typeof (content) === 'string') {
      request = { content, ...data }
    } else if (content instanceof MessageEmbed) {
      request = { embeds: [content], files: content._files }
    } else if (content instanceof MessageAttachment) {
      request = { files: [content] }
    } else {
      request = data
    }

    this.__replied = true
    return (this.__deferred
      ? this.interaction.editReply(request)
      : this.interaction.reply(request))
  }

  patchChannel () {
    this.channel.send = (content, data = {}) => this.reply(content, data)
    this.channel.stopTyping = function () {}
    this.channel.startTyping = function () {}
  }

  setFixedT (translate) {
    this.t = translate
  }

  setFlags (flags) {
    this.flags = flags
  }
}
