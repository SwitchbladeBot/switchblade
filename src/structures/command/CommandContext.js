module.exports = class CommandContext {
  /**
   * @param {Object} options The context options
   * @prop {Switchblade} client The SwitchBlade client
   * @prop {Message} message The command message
   * @prop {User} user The author of the message
   * @prop {?GuildMember} member The author of the message as a guild member
   * @prop {TextChannel} channel The channel of the message
   * @prop {?VoiceChannel} voiceChannel The voice channel of the author of the message, if any
   * @prop {?Guild} guild The guild of the channel of the message
   * @prop {Object} guildDocument The document of the guild
   * @prop {string} language The language used
   * @prop {Object} userDocument The document of the user
   * @prop {Command} command The command
   * @prop {string} aliase
   * @prop {string} prefix The command prefix
   * @prop {Object} flags
   */
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
