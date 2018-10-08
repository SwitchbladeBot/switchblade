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

    this.userDocument = options.userDocument

    this.command = options.command
    this.aliase = options.aliase
    this.prefix = options.prefix

    this.t = () => { throw new Error('Invalid FixedT') }
    this.flags = {}
  }

  setFixedT (translate) {
    this.t = translate
  }

  setFlags (flags) {
    this.flags = flags
  }
}
