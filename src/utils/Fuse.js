const Fuse = require('fuse.js')

let fuse, commandList

module.exports = (client, search) => {
  if (!commandList) {
    commandList = client.commands.map(cmd => [
      cmd.name.toLowerCase(),
      ...((cmd.aliases && cmd.aliases.map(a => a.toLowerCase())) || [])
    ]).flat(Infinity)
  }

  if (!fuse) {
    fuse = new Fuse(commandList, {
      shouldSort: true,
      threshold: 0.6,
      location: 0,
      distance: 100
    })
  }

  const results = fuse.search(search)

  if (!results.length) return false

  const [ result ] = fuse.search(search)
  return result ? commandList[result] : false
}
