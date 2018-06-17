module.exports = class CommandContext {
  constructor (options = {}) {
    this.client = options.client

    this.message = options.message
    this.author = options.message.author
    this.member = options.message.member
    this.channel = options.message.channel
    this.voiceChannel = options.message.member.voiceChannel
    this.guild = options.message.guild

    this.guildDocument = options.guildDocument
    this.language = options.language

    this.command = options.command
    this.aliase = options.aliase
    this.prefix = options.prefix
  }

  setFixedT (translate) {
    this.t = translate
  }
}