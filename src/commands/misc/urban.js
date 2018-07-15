const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../index')
const { Command, CommandParameters, StringParameter } = CommandStructures

const urban = require('urban-dictionary')

module.exports = class UrbanDictionary extends Command {
  constructor (client) {
    super(client)

    this.name = 'urban'
    this.aliases = ['urban', 'urbandictionary']
    this.parameters = new CommandParameters(this,
      new StringParameter({full: true, missingError: 'commands:urban.noWordProvided'})
    )
  }

  async run ({ t, author, channel }, text) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()

    urban.term(text, function (error, entries) {
      if (error) {
        embed.setColor(Constants.ERROR_COLOR)
          .setTitle(t('commands:urban.noDefinitionFound', {text}))
      }
      if (entries) {
        embed.setAuthor(entries[0].word, 'https://proxy.duckduckgo.com/iu/?u=http%3A%2F%2Fcdn.amreading.com%2Fwp-content%2Fuploads%2Furban-dictionary-cover.jpg&f=1')
          .setDescription(`**${t('commands:urban.definition')}**\n${entries[0].definition}\n\n**${t('commands:urban.example')}**\n${entries[0].example}`)
      }
      channel.send(embed).then(() => channel.stopTyping())
    })
  }
}
