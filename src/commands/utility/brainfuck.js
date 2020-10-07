const { Command } = require('../../')
const Brainfuck = require('brainfuck-node')
const brainfuck = new Brainfuck()

module.exports = class BrainfuckCommand extends Command {
  constructor (client) {
    super({
      name: 'brainfuck',
      category: 'utility',
      aliases: ['brainf', 'brf'],
      parameters: [
        {
          type: 'string',
          required: true,
          missingError: 'commands:brainfuck.noCode'
        },
        {
          type: 'string',
          full: true,
          required: false
        }
      ]
    }, client)
  }

  constructOutputMsg (input, t) {
    const output = `\`\`\`${input.output}\`\`\``
    return `**${t('commands:brainfuck.steps')}:** ${input.steps}\n**${t('commands:brainfuck.time')}:** ${input.time}ms\n**${t('commands:brainfuck.output')}:** ${output}`
  }

  run ({ t, channel }, code, input) {
    try {
      const result = brainfuck.execute(code, input)
      const outputMsg = this.constructOutputMsg(result, t)
      channel.send(outputMsg)
    } catch (err) {
      if (err.name === 'BrainfuckError') {
        const outputMsg = this.constructOutputMsg(err.result, t)
        channel.send(`**${t('commands:brainfuck.error')}:** ${err.message}\n${outputMsg}`)
      } else {
        throw err
      }
    }
  }
}
