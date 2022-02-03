// const { Parser } = require('acorn')

module.exports = class DiscordUtils {
  /**
  * @param  {String} userID - The id of the user who should have permission checked.
  * @param  {Object} channel - The channel from the message.
  * @param  {Array<String>} permissions - An Array with discord permissions.
  * @param  {Function} t - The translate function.
  * @param  {String} blameWho - Who to blame if the permission is missing.
  * @returns {String}
  */
  static ensurePermissions (userID, channel, permissions, t, blameWho) {
    for (let i = 0; i < permissions.length; i++) {
      const permission = permissions[i]
      if (!channel.permissionsFor(userID).has(permission)) {
        return t(blameWho === 'bot' ? 'errors:iDontHavePermission' : 'errors:youDontHavePermissionToRead', { permission })
      }
    }

    return null
  }

  static convertCommandsToDiscordPayload (t, commands) {
    return commands.map((cmd) => DiscordUtils.convertCommandToDiscordPayload(t, cmd))
  }

  static convertCommandToDiscordPayload (t, command) {
    const data = { options: [] }
    if (command.parameters?.[0]) {
      data.options = DiscordUtils.convertParameterListToDiscordPayload(command)
    }

    if (command.subcommands?.[0]) {
      command.subcommands.forEach((sub) => {
        const opts = sub.parameters?.[0]
          ? { options: DiscordUtils.convertParameterListToDiscordPayload(sub) }
          : {}

        data.options.push({
          type: 1,
          name: sub.name,
          description: t([`commands:${command.tPath}.subcommands.${sub.name}.commandDescription`, 'commands:help.noDescriptionProvided']) || 'No description provided.',
          ...opts
        })
      })
    }

    return {
      name: command.name,
      description: t([`commands:${command.tPath}.commandDescription`, 'commands:help.noDescriptionProvided']) || 'No description provided.',
      ...data
    }
  }

  static convertParameterListToDiscordPayload (command, params = command.parameters) {
    const typeList = { string: 3, integer: 4, boolean: 5, user: 6, member: 6, channel: 7, role: 8, mentionable: 9, number: 10 }
    let argList = (command.search || command.run).toString().split('\n')[0].replace(/(async )?([a-z]+ )\((_|context|\{[\s\S]*?\})?(, )?/g, '').replace(') {', '').trim()
    if (argList) argList = argList.split(',').map(z => z.split(' = ')[0].trim())

    const options = []
    params.forEach((a, i) => {
      if (a instanceof Array) {
        // flag parsing
        a.forEach((flag) => {
          options.push({
            name: flag.name.toLowerCase(),
            type: typeList[flag.type.replace('Flag')] ?? typeList.boolean,
            required: false,
            description: 'aaaa'
          })
        })
      } else {
        options.push({
          name: (argList?.[i] ?? `${command.name.split('')[0]}${i}`).toLowerCase(),
          type: typeList[a.type] ?? typeList.string,
          required: a.isRequired ?? (a.full || false),
          description: 'PAJUBA'
        })
      }
    })
    return options.sort(x => x.required ? -1 : 1)
  }
}
