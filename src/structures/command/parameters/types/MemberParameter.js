const Parameter = require('./Parameter.js')
const CommandError = require('../../CommandError.js')

const MENTION_REGEX = /^(?:<@!?)?([0-9]{16,18})(?:>)?$/

module.exports = class MemberParameter extends Parameter {
  constructor (options = {}) {
    super(options)
  }

  parse (arg, { guild }) {
    if (!arg) return

    const regexResult = MENTION_REGEX.exec(arg)
    let memberId = regexResult && regexResult[1]
    return this.member(guild, memberId)
  }

  member (guild, id) {
    return guild.members.get(id) || new CommandError('You need to give me a valid member for that guild!')
  }
}
