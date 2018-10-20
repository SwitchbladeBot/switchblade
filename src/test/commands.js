const FileUtils = require('../utils/FileUtils.js')
const MiscUtils = require('../utils/MiscUtils.js')

const commands = []

FileUtils.requireDirectory('src/commands', (NewCommand) => {
  if (NewCommand.ignore) return
  commands.push(NewCommand)
}, console.error).catch(console.error)

describe('Commands', () => {
  it('should have no duplicate names or aliases', (done) => {
    let aliases = []
    commands.forEach(NewCommand => {
      aliases = aliases.concat(new NewCommand().aliases)
    })
    const dupes = MiscUtils.findArrayDuplicates(commands.map(CurrentCommand => new CurrentCommand().name).concat(aliases))
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
    let notInCommandsFile = []
    const commandsFile = require('../../src/locales/en-US/commands.json')
    commands.forEach(CurrentCommand => {
      const name = new CurrentCommand().name
      if (!commandsFile[name]) notInCommandsFile.push(name)
    })
    if (notInCommandsFile.length) {
      done(new Error(`The following commands are not in commands.json: ${notInCommandsFile.join(', ')}`))
    } else {
      done()
    }
  })

  it('should have descriptions', (done) => {
    let noDescription = []
    const commandsFile = require('../../src/locales/en-US/commands.json')
    commands.forEach(CurrentCommand => {
      const name = new CurrentCommand().name
      if (!commandsFile[name] || !commandsFile[name]['commandDescription']) noDescription.push(name)
    })
    if (noDescription.length) {
      done(new Error(`The following commands don't have descriptions: ${noDescription.join(', ')}`))
    } else {
      done()
    }
  })
})
