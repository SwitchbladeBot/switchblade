const { Module } = require('../')
const { Role } = require('discord.js')

const _ = require('lodash')

// Helpers
const parseString = (s) => s.replace(/\s+/g, '__')
const parseName = (c) => parseString(c.fullName)
const commandsPath = (c) => `commands.${c}`
const categoriesPath = (c) => `categories.${c}`
const recPaths = (c) => {
  const arr = [parseName(c)]
  return c.parentCommand ? arr.concat(recPaths(c.parentCommand)) : arr
}

const findCommand = (commands, path) => {
  const findCA = (a, c) => a.find(o => o.name === c)
  const [ c, ...sc ] = path.split(/\s+/)
  const cmd = findCA(commands, c)
  return cmd ? sc.length ? sc.reduce((s, n) => findCA(s, n), cmd.subcommands) : cmd : null
}

const categoryExists = (client, category) => {
  const categories = client.commands
    .filter(c => !c.hidden)
    .map(c => c.category)
    .filter((v, i, a) => a.indexOf(v) === i)
  return categories.includes(category)
}

// Commands
module.exports = class CommandsModule extends Module {
  constructor (client) {
    super('commandRules', client)
    this.displayName = 'Command Rules'

    this.toggleable = false
    this.defaultValues = {
      all: {},
      commands: {},
      categories: {}
    }
    this.apiMethods = [ 'retrieveCommand', 'saveCommand', 'validCandidates' ]
  }

  specialInput (guildId) {
    const joinAliases = (c) => {
      const { aliases = [] } = c
      return c.parentCommand ? aliases.concat(joinAliases(c.parentCommand)) : aliases
    }
    const addCommand = (a, c) => {
      if (c.hidden) return a
      a.push({
        name: c.fullName,
        aliases: joinAliases(c),
        category: c.category
      })
      return c.subcommands.length ? c.subcommands.reduce((na, sc) => addCommand(na, sc), a) : a
    }

    const commands = this.client.commands.reduce((a, c) => addCommand(a, c), [])
    const categories = commands.map(c => c.category).filter((v, i, a) => a.indexOf(v) === i)
    return {
      commands: commands.concat(categories.map(c => ({
        name: c,
        aliases: [],
        category: 'category'
      })), [{
        name: 'all commands',
        aliases: [ '*' ],
        category: 'all'
      }])
    }
  }

  async verifyCommand (command, { guild, channel, member }) {
    // if (member.hasPermission('ADMINISTRATOR')) return true

    const allCommands = recPaths(command)
    const { commands, categories, all } = await this.retrieveValues(guild.id, [
      ...allCommands.map(commandsPath),
      categoriesPath(command.category),
      'all'
    ])

    // Typefilter
    const tf = (t) => (r) => r.type === t

    // Verify
    const verify = (whitelist, blacklist, end = () => true) => {
      if (!whitelist.length && !blacklist.length) return end()

      // User whitelist
      if (whitelist.filter(tf('user')).some(r => r.id === member.id)) return true
      // User blacklist
      if (blacklist.filter(tf('user')).some(r => r.id === member.id)) return false

      // Roles
      const wRoles = whitelist.filter(tf('role')).map(r => member.roles.get(r.id)).filter(r => !!r).sort(Role.comparePositions)
      const bRoles = blacklist.filter(tf('role')).map(r => member.roles.get(r.id)).filter(r => !!r).sort(Role.comparePositions)
      if (wRoles.length && !bRoles.length) return true
      else if (!wRoles.length && bRoles.length) return false
      else if (wRoles.length && bRoles.length) {
        return wRoles.pop().comparePositionTo(bRoles.pop()) > 0
      }

      // Channel whitelist
      if (whitelist.filter(tf('channel')).some(c => c.id === channel.id)) return true
      // Channel blacklist
      if (blacklist.filter(tf('channel')).some(c => c.id === channel.id)) return false

      if (channel.parentID) {
        // Category whitelist
        if (whitelist.filter(tf('category')).some(c => c.id === channel.parentID)) return true
        // Category blacklist
        if (blacklist.filter(tf('category')).some(c => c.id === channel.parentID)) return false
      }

      // All whitelist
      if (whitelist.some(tf('all'))) return true
      // All blacklist
      if (blacklist.some(tf('all'))) return false

      return end()
    }

    // Check
    const { whitelist: catWhitelist = [], blacklist: catBlacklist = [] } = categories[command.category] || {}
    const { whitelist: allWhitelist = [], blacklist: allBlacklist = [] } = all || {}
    const check = (command) => {
      const path = parseName(command)
      const { blacklist = [], whitelist = [] } = commands[path] || {}
      return verify(whitelist, blacklist, () => (
        command.parentCommand
          ? check(command.parentCommand)
          : verify(catWhitelist, catBlacklist, () => verify(allWhitelist, allBlacklist))
      ))
    }
    return check(command)
  }

  // API Methods
  async retrieveCommand (guildId, userId, { cmd, isCategory } = {}) {
    if (!cmd || typeof cmd !== 'string') return { status: 400 }

    const guild = this.client.guilds.get(guildId)
    if (!guild) return { status: 400 }

    const mapValues = (v) => {
      const o = {
        type: v.type,
        id: v.id
      }

      switch (v.type) {
        case 'category':
        case 'channel':
          const channel = guild.channels.get(v.id)
          if (!channel) o.missing = true
          else o.name = channel.name
          break
        case 'role':
          const role = guild.roles.get(v.id)
          if (!role) o.missing = true
          else o.name = role.name
          break
        case 'user':
          const m = guild.member(v.id)
          if (!m) o.missing = true
          else {
            o.name = m.user.username
            o.discriminator = m.user.discriminator
            o.displayName = m.displayName
          }
      }

      return o
    }

    if (cmd === 'all') {
      const all = await this.retrieveValue(guildId, 'all')
      return { payload: {
        whitelist: all && all.whitelist ? all.whitelist.map(mapValues) : [],
        blacklist: all && all.blacklist ? all.blacklist.map(mapValues) : []
      } }
    } else if (isCategory) {
      if (!categoryExists(this.client, cmd)) return { status: 400 }
      const path = parseString(cmd)
      const { categories: { [path]: data } } = await this.retrieveValues(guildId, [ categoriesPath(path) ])
      return { payload: {
        whitelist: data && data.whitelist ? data.whitelist.map(mapValues) : [],
        blacklist: data && data.blacklist ? data.blacklist.map(mapValues) : []
      } }
    }

    const command = findCommand(this.client.commands, cmd)
    if (!command) return { status: 400 }

    const path = parseName(command)
    const { commands: { [path]: data } } = await this.retrieveValues(guildId, [ commandsPath(path) ])
    return { payload: {
      whitelist: data && data.whitelist ? data.whitelist.map(mapValues) : [],
      blacklist: data && data.blacklist ? data.blacklist.map(mapValues) : []
    } }
  }

  async saveCommand (guildId, userId, { cmd, values, isCategory } = {}) {
    if (!cmd || typeof cmd !== 'string') return { status: 400 }

    const command = cmd !== 'all' ? isCategory ? cmd : findCommand(this.client.commands, cmd) : true
    if (!command || (isCategory && !categoryExists(this.client, command))) return { status: 400 }

    // Validate
    const candidates = this.fetchAllCandidates(guildId, userId)
    const validate = (l) => {
      if (!l || !Array.isArray(l)) return false
      return l.every(o => {
        if (!o || typeof o !== 'object' || !o.type || !o.id) return false
        switch (o.type) {
          case 'all':
            return o.id === 'all'
          default:
            return candidates.includes(o.id)
        }
      })
    }

    // Check
    const { whitelist, blacklist } = values
    const valid = validate(whitelist) && validate(blacklist)
    if (!valid || whitelist.find(v => blacklist.find(oV => _.isEqual(v, oV)))) throw new Error('INVALID_LIST')

    // Clear?
    const path = cmd !== 'all' ? isCategory ? categoriesPath(command) : commandsPath(parseName(command)) : 'all'
    if (!whitelist.length && !blacklist.length) {
      await this._guilds.update(guildId, { $unset: { [`modules.${this.name}.values.${path}`]: '' } })
      return { ok: true }
    }

    // Update
    const defMap = (o) => ({ id: o.id, type: o.type })
    await this.updateValues(guildId, {
      [path]: {
        whitelist: whitelist.map(defMap),
        blacklist: blacklist.map(defMap)
      }
    }, null, false)

    return { ok: true }
  }

  fetchAllCandidates (guildId, userId) {
    const guild = this.client.guilds.get(guildId)
    if (!guild || !userId) return []
    const member = guild.member(userId)

    // Category
    const filteredCategories = guild.channels
      .filter(c => c.type === 'category' && c.memberPermissions(member).has('VIEW_CHANNEL'))
      .map(c => c.id)
    // Channel
    const filteredChannels = guild.channels
      .filter(c => c.type === 'text' && c.memberPermissions(member).has('VIEW_CHANNEL'))
      .map(c => c.id)

    // Role
    const filteredRoles = guild.roles
      .filter(r => r.editable && r.id !== guildId && member.highestRole.comparePositionTo(r) > 0)
      .map(r => r.id)
    // User
    const filteredUsers = guild.members.map(m => m.id)

    return [
      ...filteredCategories,
      ...filteredChannels,
      ...filteredRoles,
      ...filteredUsers
    ]
  }

  async validCandidates (guildId, userId, { q } = {}) {
    if (!q || typeof q !== 'string') return { status: 400 }

    const guild = this.client.guilds.get(guildId)
    if (!guild || !userId) return { status: 500 }
    const member = guild.member(userId)

    const cq = (t) => t.toLowerCase().includes(q.toLowerCase())
    const iq = (i) => q === i.id

    // Category
    const filteredCategories = guild.channels
      .filter(c => c.type === 'category' && c.memberPermissions(member).has('VIEW_CHANNEL') && (cq(c.name) || iq(c)))
      .first(10)
      .map(c => ({
        id: c.id,
        type: 'category',
        name: c.name
      }))
    // Channel
    const filteredChannels = guild.channels
      .filter(c => c.type === 'text' && c.memberPermissions(member).has('VIEW_CHANNEL') && (cq(c.name) || iq(c)))
      .first(10)
      .map(c => ({
        id: c.id,
        type: 'channel',
        name: c.name
      }))

    // Role
    const filteredRoles = guild.roles
      .filter(r => r.editable && r.id !== guildId && member.highestRole.comparePositionTo(r) > 0 && (cq(r.name) || iq(r)))
      .sort(Role.comparePositions)
      .first(10)
      .map(r => ({
        id: r.id,
        type: 'role',
        name: r.name
      }))
    // User
    const filteredUsers = guild.members
      .filter(m => cq(m.displayName) || cq(m.user.username) || iq(m))
      .first(10)
      .map(m => ({
        id: m.id,
        type: 'user',
        name: m.user.username,
        discriminator: m.user.discriminator,
        displayName: m.displayName
      }))

    return { payload: { candidates: [
      ...filteredCategories,
      ...filteredChannels,
      ...filteredRoles,
      ...filteredUsers,
      { type: 'all', id: 'all' }
    ] } }
  }
}
