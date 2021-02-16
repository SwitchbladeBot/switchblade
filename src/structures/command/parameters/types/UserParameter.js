const Parameter = require('./Parameter.js')
const CommandError = require('../../CommandError.js')
const PermissionUtils = require('../../../../utils/PermissionUtils.js')

const MENTION_REGEX = /^(?:<@!?)?([0-9]{16,18})(?:>)?$/
const defVal = (o, k, d) => typeof o[k] === 'undefined' ? d : o[k]

module.exports = class UserParameter extends Parameter {
  static parseOptions (options = {}) {
    return {
      ...super.parseOptions(options),
      /**
       * If the given user can be a bot.
       */
      acceptBot: !!options.acceptBot,
      /**
       * If the given user can be a Discord user.
       */
      acceptUser: defVal(options, 'acceptUser', true),
      /**
       * If the given user can be a Bot Developer.
       */
      acceptDeveloper: defVal(options, 'acceptDeveloper', true),
      /**
       * if the given user can be the one who invoked the command.
       */
      acceptSelf: !!options.acceptSelf,
      /**
       * If a member should be returned instead of a user, if possible.
       */
      acceptPartial: !!options.acceptPartial,
      errors: {
        invalidUser: 'errors:invalidUser',
        acceptSelf: 'errors:sameUser',
        acceptBot: 'errors:invalidUserBot',
        acceptUser: 'errors:invalidUserNotBot',
        acceptDeveloper: 'errors:userCantBeDeveloper',
        acceptPartial: 'errors:userPartial',
        ...(options.errors || {})
      }
    }
  }

  /**
  * Returns if the given arg is a user name or id.
  * @function
  * @param {string} arg - The name/id of the user its going to search
  * @param {*} regex - A regex that checks if the arg is a valid user snowflake
  * @returns {'name' | 'id'}
  */
  static idOrName (arg, regex) {
    return regex.test(arg) ? 'id' : 'name'
  }

  /**
  * Tries to find the user, first checks the cache, if not found it requests from Discord.
  * @function
  * @param {object} client - The bot client
  * @param {string} arg - The name/id of the user its going to search
  * @returns {object} - The user object or null if not found.
  */
  static async findUser (client, arg) {
    const checkForId = this.idOrName(arg, MENTION_REGEX) === 'id'

    if (checkForId) {
      let user = client.users.cache.get(arg)

      if (!user) {
        try {
          user = await client.users.fetch(arg)
        } catch (e) {
          user = null
        }
      }

      return user || null
    }

    return client.users.cache.find(u => u.username.toLowerCase() === arg.toLowerCase()) || null
  }

  /**
  * Tries to find the member, first checks the cache, if not found it requests from Discord.
  * @function
  * @param {object} guild - The guild whose the command was executed
  * @param {string} arg - The name/id of the user its going to search
  * @returns {object} - The member object or null if not found.
  */
  static async findMember (guild, arg) {
    const checkForId = this.idOrName(arg, MENTION_REGEX) === 'id'

    if (checkForId) {
      let member = guild.members.cache.get(arg)

      // Avoid making a discord request if user is already cached.
      if (!member) {
        try {
          member = await guild.members.fetch(arg) || null
        } catch (e) {
          member = null
        }
      }

      return member || null
    }

    let member = guild.members.cache.find(m => m.user.username.toLowerCase().includes(arg.toLowerCase()) || m.displayName.toLowerCase().includes(arg.toLowerCase()))

    if (!member) {
      try {
        await guild.members.fetch()
        member = guild.members.cache.find(m => m.user.username.toLowerCase().includes(arg.toLowerCase()) || m.displayName.toLowerCase().includes(arg.toLowerCase()))
      } catch (e) {
        member = null
      }
    }

    return member || null
  }

  static async parse (arg, { t, client, author, guild }) {
    let user = null
    if (!arg) user = author

    const regexResult = MENTION_REGEX.exec(arg)
    const id = regexResult && regexResult[1]
    const strictArg = id === null ? arg || author.id : id

    if (this.acceptPartial) {
      user = await UserParameter.findMember(guild, strictArg)
    }

    if (!user) {
      user = await UserParameter.findUser(client, strictArg)
    }

    if (!user) throw new CommandError(t(this.errors.invalidUser))

    // If we found a member, get the user from the member
    const userToCheck = user.user ? user.user : user
    if (!this.acceptSelf && userToCheck.id === author.id) throw new CommandError(t(this.errors.acceptSelf))
    if (!this.acceptBot && userToCheck.bot) throw new CommandError(t(this.errors.acceptBot))
    if (!this.acceptUser && !userToCheck.bot) throw new CommandError(t(this.errors.acceptUser))
    if (!this.acceptDeveloper && PermissionUtils.isDeveloper(client, userToCheck)) throw new CommandError(t(this.errors.acceptDeveloper), false)

    return user
  }
}
