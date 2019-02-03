const Parameter = require('./Parameter.js')
const CommandError = require('../../CommandError.js')

const MENTION_REGEX = /^(?:<@!?)?([0-9]{16,18})(?:>)?$/

// TODO: Make this extend UserParameter
module.exports = class MemberParameter extends Parameter {
  constructor (options = {}) {
    options = Object.assign({ acceptBot: false, acceptUser: true, acceptSelf: false }, options)
    super(options)
    this.acceptBot = !!options.acceptBot
    this.acceptUser = !!options.acceptUser
    this.acceptSelf = !!options.acceptSelf
  }

  parse (arg, context) {
    if (!arg) return

    const regexResult = MENTION_REGEX.exec(arg)
    const userId = regexResult && regexResult[1]
    return this.member(context, userId)
  }

  member ({ t, guild, author }, id) {
    const member = guild.members.get(id)
    if (!member) throw new CommandError(t('errors:invalidUser'))
    if (!this.acceptSelf && id === author.id) throw new CommandError(t('errors:sameUser'))
    if (!this.acceptBot && member.user.bot) throw new CommandError(t('errors:invalidUserBot'))
    if (!this.acceptUser && !member.user.bot) throw new CommandError(t('errors:invalidUserNotBot'))
    return member
  }
}
