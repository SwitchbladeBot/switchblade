const { Command } = require('../../')
const math = require('mathjs')

module.exports = class Math extends Command {
  constructor (client) {
    super(client)
    this.name = 'math'
  }

  run (message, args) {
    let result
    message.channel.startTyping()
    try {
      result = math.eval(args.join(' '))
    } catch (error) {
      this.client.log(`Failed math calculation ${args.join(' ')}\nError: ${error.stack}`, this.name)
      message.channel.send(`Error while evaluating the math expression: ${error.stack}`)
    } finally {
      if (isNaN(parseFloat(result))) {
        message.channel.send('Invalid calculation expression')
      } else {
        message.channel.send(`Result: \`${result}\``)
      }
    }
    message.channel.stopTyping()
  }
}
