const { Module } = require('../')
const { Role } = require('discord.js')

const Joi = require('@hapi/joi')

// Helpers
const parseName = (c) => c.fullName.replace(/\s+/g, '__')
const commandsPath = (c) => `commands.${c}`
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

// Commands
module.exports = class CommandsModule extends Module {
  constructor (client) {
    super('commands', client)
    this.displayName = 'Commands'

    this.toggleable = false
    this.defaultValues = {
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
    return { commands }
  }

  async verifyCommand (command, { guild, channel, member }) {
    const allCommands = recPaths(command)
    const { commands, categories } = await this.retrieveValues(guild.id, [
      ...allCommands.map(commandsPath),
      `categories.${command.category}`
    ])

    // Check
    const { whitelist: catWhitelist = [], blacklist: catBlacklist = [] } = categories[command.category] || {}

    const whitelist = allCommands.reduce((a, p) => (a.concat((commands[p] || {}).whitelist || [])), []).concat(catWhitelist)
    const blacklist = allCommands.reduce((a, p) => (a.concat((commands[p] || {}).blacklist || [])), []).concat(catBlacklist)

    const checkConditions = (whitelist, blacklist) => {
      let userCheck = null
      let roleCheck = null
      let channelCheck = null
      let categoryCheck = null

      if (whitelist.length) {
        const channelTypes = whitelist.filter(r => r.type === 'channel')
        channelCheck = channelTypes.length ? channelTypes.some(r => channel.id === r.id) : null

        const categoryTypes = whitelist.filter(r => r.type === 'category')
        categoryCheck = categoryTypes.length ? categoryTypes.some(r => (
          channel.parentID && channel.parentID === r.id
        )) : null

        const userTypes = whitelist.filter(r => r.type === 'user')
        userCheck = userTypes.length ? userTypes.some(r => member.id === r.id) : null

        const roleTypes = whitelist.filter(r => r.type === 'role')
        roleCheck = roleTypes.length ? roleTypes.some(r => member.roles.has(r.id)) : null
      }

      if (blacklist.length) {
        if (channelCheck === null) {
          const bChannelTypes = blacklist.filter(r => r.type === 'channel')
          channelCheck = bChannelTypes.length ? bChannelTypes.every(r => channel.id !== r.id) : true
        }

        if (categoryCheck === null) {
          const bCategoryTypes = blacklist.filter(r => r.type === 'category')
          categoryCheck = bCategoryTypes.length ? bCategoryTypes.every(r => (
            !channel.parentID || channel.parentID !== r.id
          )) : true
        }

        if (userCheck === null) {
          const bUserTypes = blacklist.filter(r => r.type === 'user')
          userCheck = bUserTypes.length ? bUserTypes.every(r => member.id !== r.id) : true
        }

        if (roleCheck === null) {
          const bRoleTypes = blacklist.filter(r => r.type === 'role')
          roleCheck = bRoleTypes.length ? bRoleTypes.every(r => !member.roles.has(r.id)) : true
        }
      } else {
        if (channelCheck === null) channelCheck = true
        if (categoryCheck === null) categoryCheck = true
        if (userCheck === null) userCheck = true
        if (roleCheck === null) roleCheck = true
      }

      return channelCheck && categoryCheck && userCheck && roleCheck
    }

    console.log(whitelist, blacklist)
    return checkConditions(whitelist, blacklist)
  }

  // API Methods
  async retrieveCommand (guildId, userId, { cmd } = {}) {
    if (!cmd || typeof cmd !== 'string') return { status: 400 }

    const guild = this.client.guilds.get(guildId)
    if (!guild) return { status: 400 }

    const command = findCommand(this.client.commands, cmd)
    if (!command) return { status: 400 }

    const path = parseName(command)
    console.log(commandsPath(path))
    const { commands: { [path]: data } } = await this.retrieveValues(guildId, [ commandsPath(path) ])

    const mapValues = (v) => {
      const o = {
        type: v.type,
        id: v.id
      }

      switch (v.type) {
        case 'category':
        case 'channel':
          o.name = guild.channels.get(v.id).name
          break
        case 'role':
          o.name = guild.roles.get(v.id).name
          break
        case 'user':
          const m = guild.member(v.id)
          o.name = m.user.username
          o.discriminator = m.user.discriminator
          o.displayName = m.displayName
      }

      return o
    }

    console.log(data)
    return { payload: {
      whitelist: data && data.whitelist ? data.whitelist.map(mapValues) : [],
      blacklist: data && data.blacklist ? data.blacklist.map(mapValues) : []
    } }
  }

  async saveCommand (guildId, userId, { cmd, values } = {}) {
    if (!cmd || typeof cmd !== 'string') return { status: 400 }

    const command = findCommand(this.client.commands, cmd)
    if (!command) return { status: 400 }

    const path = commandsPath(parseName(command))
    console.log(path)
    // Validate values
    const candidates = this.fetchAllCandidates(guildId, userId)
    const schema = Joi.array().items(Joi.object().keys({
      id: Joi.string().valid(...candidates),
      type: Joi.string().valid('channel', 'category', 'role', 'user')
    }).unknown())
    const { error: wError, value: wValue } = schema.validate(values.whitelist)
    const { error: bError, value: bValue } = schema.validate(values.blacklist)
    console.log(wValue, bValue)
    if (wError || bError) throw wError || bError

    const defMap = (o) => ({ id: o.id, type: o.type })
    await this.updateValues(guildId, {
      [path]: { whitelist: wValue.map(defMap), blacklist: bValue.map(defMap) }
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
      ...filteredUsers
    ] } }
  }
}
