const { Command, SwitchbladeEmbed } = require('../../')

module.exports = class Reminder extends Command {
  constructor (client) {
    super(client, {
      name: 'reminder',
      aliases: ['remindme'],
      category: 'utility',
      parameters: [{
        type: 'string',
        full: true,
        missingError: 'commands:reminder.missingDate'
      }]
    })
  }

  async run ({ t, author, channel, message, language }, dateString) {
    // Stuff
  }
}
