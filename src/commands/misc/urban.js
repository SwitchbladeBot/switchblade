const { Command, SwitchbladeEmbed, Constants } = require('../../')
const urban = require('urban')

module.exports = class Urban extends Command {
  constructor (client) {
    super(client)
    this.name = 'urban'
    this.aliases = ['urbancidionary']
  }

  async run (message, args) {
    const embed = new SwitchbladeEmbed(message.author)
    if (args.length > 0) {
      let search = urban(args.join(' '))
      search.first(function (query) {
        if (query) {
          if (!query.definition || !query.example) return
          if (query.definition.length > 1000) query.definition = query.definition.substr(0, 1000)
          if (query.example.length > 1000) query.example = query.example.substr(0, 1000)
          embed.setAuthor(`Urban Dictionary: "${query.word}"`, 'https://i.imgur.com/4Wh085V.jpg', query.permalink)
          embed.setColor(Constants.URBAN_COLOR)
          embed.addField('Definition:', query.definition)
          embed.addField('Example:', query.example)
          message.channel.send({embed})
        } else {
          embed.setColor(Constants.ERROR_COLOR)
          embed.setTitle('I couldn\'t find any match.')
          message.channel.send({embed})
        }
      })
    } else {
      embed.setColor(Constants.ERROR_COLOR)
      embed.setTitle('You need to give me something to search.')
      embed.setDescription(`**Usage:** \`${process.env.PREFIX}${this.name} <word>\``)
      message.channel.send({embed})
    }
  }
}
