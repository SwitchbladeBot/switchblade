/* globals describe, it */

const FileUtils = require('../utils/FileUtils.js')
const MiscUtils = require('../utils/MiscUtils.js')

const commands = []

FileUtils.requireDirectory('src/commands', (NewCommand) => {
  const { parentCommand } = new NewCommand()
  if (typeof parentCommand !== 'string' && !Array.isArray(parentCommand)) commands.push(NewCommand)
}, console.error).catch(console.error)

describe('Commands', () => {
  it('should have no duplicate names or aliases', (done) => {
    const aliases = commands.reduce((arr, NewCommand) => {
      const { name, aliases } = new NewCommand()
      return [...arr, name, ...(aliases || [])]
    }, [])
    const dupes = MiscUtils.findArrayDuplicates(aliases)
    if (dupes.length) {
      done(new Error(`The following names or aliases were found more than once: ${dupes.join(', ')}`))
    } else {
      done()
    }
  })

  it('should have no duplicate class names', (done) => {
    const classNames = commands.map(c => c.name)
    const dupes = MiscUtils.findArrayDuplicates(classNames)
    if (dupes.length) {
      done(new Error(`The following class names were found more than once: ${dupes.join(', ')}`))
    } else {
      done()
    }
  })

  it('should be in commands.json', (done) => {
    const commandsFile = require('../../src/locales/en-US/commands.json')
    const notInCommandsFile = commands.map(CurrentCommand => new CurrentCommand()).filter(command => {
      const { name, parentCommand } = command
      if (parentCommand) {
        if (typeof parentCommand === 'string') {
          const parentSubcommands = commandsFile[parentCommand] && commandsFile[parentCommand].subcommands
          return !(parentSubcommands && parentSubcommands[name])
        } else if (Array.isArray(parentCommand)) {
          return !parentCommand.reduce((o, ca) => {
            if (o === undefined) return commandsFile[ca] || false
            return o.subcommands && o.subcommands[ca]
          })
        }
      }
      return !commandsFile[name]
    })
    if (notInCommandsFile.length) {
      done(new Error(`The following commands are not in commands.json: ${notInCommandsFile.map(c => c.name).join(', ')}`))
    } else {
      done()
    }
  })

  it('should have descriptions', (done) => {
    const commandsFile = require('../../src/locales/en-US/commands.json')
    const noDescription = commands.map(CurrentCommand => new CurrentCommand()).filter(command => {
      const { name, parentCommand } = command
      if (parentCommand) {
        if (typeof parentCommand === 'string') {
          const parentSubcommands = commandsFile[parentCommand] && commandsFile[parentCommand].subcommands
          return !(parentSubcommands && parentSubcommands[name] && parentSubcommands[name].commandDescription)
        } else if (Array.isArray(parentCommand)) {
          const finalCommand = parentCommand.reduce((o, ca) => {
            if (o === undefined) return commandsFile[ca] || false
            return o.subcommands && o.subcommands[ca]
          })
          return !(finalCommand && finalCommand.commandDescription)
        }
      }
      return !(commandsFile[name] && commandsFile[name].commandDescription)
    })
    if (noDescription.length) {
      done(new Error(`The following commands don't have descriptions: ${noDescription.map(c => c.name).join(', ')}`))
    } else {
      done()
    }
  })
})
