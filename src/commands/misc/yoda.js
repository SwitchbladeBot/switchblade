const { Command, SwitchbladeEmbed } = require('../../index')
const soap = require('soap')

module.exports = class Yoda extends Command {
  constructor (client) {
    super(client, {
      name: 'yoda',
      aliases: ['yodasays', 'yodasay', 'yodaspeak', 'yodaspeaks'],
      parameters: [
        {
          type: 'string',
          full: true,
          missingError: 'commands:yoda.missingSentence'
        }
      ]
    })
  }

  async run ({ t, author, channel }, text) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()

    soap.createClient(
      'https://www.yodaspeak.co.uk/webservice/yodatalk.php?wsdl',
      function (err, client) {
        if (err) {
          embed.setDescription('commands.yoda.error')
        }
        client.yodaTalk({ inputText: text }, function (err, result) {
          if (err) {
            embed.setDescription('commands.yoda.error')
          }
          embed.setDescription(result.return)
        })
      }
    )

    channel.send(embed).then(() => channel.stopTyping())
  }
}
