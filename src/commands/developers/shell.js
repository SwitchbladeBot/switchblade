const { exec } = require('child_process')
const { Command } = require('../../')

module.exports = class Shell extends Command {
  constructor (client) {
    super({
      name: 'shell',
      category: 'developers',
      hidden: true,
      requirements: { devOnly: true },
      parameters: [{
        type: 'string', full: true, missingError: 'errors:missingParameters', showUsage: false
      }]
    }, client)
  }

  run ({ channel }, command) {
    exec(command, (error, stdout, stderr) => {
      if (error || stderr) return channel.send(`\`${command}\`\n\`\`\`${stderr}\`\`\``)
      channel.send(`\`${command}\`\n\`\`\`${stdout}\`\`\``)
    })
  }
}
