const Command = require('./Command.js')
const SwitchbladeEmbed = require('../SwitchbladeEmbed.js')

module.exports = class SubcommandListCommand extends Command {
  constructor (client, options = {}) {
    super(client, options)
    this.embedColor = options.embedColor
    this.authorString = options.authorString
    this.authorImage = options.authorImage
    this.authorURL = options.authorURL
    this.embedColor = options.embedColor
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
