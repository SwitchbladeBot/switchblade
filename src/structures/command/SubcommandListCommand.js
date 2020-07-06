const Command = require('./Command.js')
const SwitchbladeEmbed = require('../SwitchbladeEmbed.js')
const Utils = require('../../utils')

module.exports = class SubcommandListCommand extends Command {
  constructor (opts, client) {
    const options = Utils.createOptionHandler('SubcommandListCommand', opts)

    super(opts, client)

    this.embedColor = options.optional('embedColor')
    this.authorString = options.required('authorString')
    this.authorImage = options.optional('authorImage')
    this.authorURL = options.optional('authorURL')
  }

  async run ({ channel, author, t, prefix }) {
    channel.send(
      new SwitchbladeEmbed(author)
        .setAuthor(t(this.authorString), this.authorImage, this.authorURL)
        .setDescriptionFromBlockArray(this.subcommands.map(subcommand => {
          return [
            `\`${subcommand.usage(t, prefix, false, true)}\``,
            t([`commands:${subcommand.tPath}.commandDescription`, 'commands:help.noDescriptionProvided'])
          ]
        }))
        .setColor(this.embedColor || process.env.EMBED_COLOR)
    )
  }
}
