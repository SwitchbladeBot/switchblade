const { Command, CommandError, Constants, SwitchbladeEmbed } = require('../..')

const platforms = { xbox: '1', psn: '2', origin: '5', pc: '5' }

module.exports = class ApexLegendsPlayer extends Command {
  constructor (client) {
    super(client, {
      name: 'apexlegends',
      category: 'games',
      aliases: ['apex', 'apexl'],
      parameters: [{
        type: 'string',
        whitelist: platforms,
        missingError: 'commands:apexlegends.noPlatform'
      }, {
        type: 'string',
        full: true,
        missingError: 'commands:apexlegends.noPlayer'
      }],
      embedColor: Constants.APEX_LEGENDS_COLOR
    })
  }

  async run ({ t, channel, author, language }, platform, player) {
    channel.startTyping()
    // TODO: Return lifetime stats of the user + available legends when no flgas.
    // TODO: Return lifetime stats of the user + legend infos - each in separate embed.
    // Multiple legend infos: hand it off to a function, to display all of the legends in separate embed.
    // text = text.replace(/\s/g, '/')
    platform = platforms[platform]
    const response = await this.client.apis.apexlegends.getPlayer(platform, player)

    if (response.errors) {
      // TODO: Write the account not found string
      throw new CommandError(t(response.errors[0].message))
    } else {
      let description = '**Legends**\n\n'
      const embed = new SwitchbladeEmbed()
        .setAuthor(response.data.metadata.platformUserHandle)
        .addField(response.data.stats[0].metadata.name, response.data.stats[0].displayValue, true)
        .addField(response.data.stats[1].metadata.name, response.data.stats[1].displayValue, true)
        .addField(response.data.stats[2].metadata.name, response.data.stats[2].displayValue, true)
        .addField(`Rank`, `#${response.data.stats[0].displayRank}`, true)
        .addField(`Rank`, `#${response.data.stats[1].displayRank}`, true)
        .addField(`Rank`, `#${response.data.stats[2].displayRank}`, true)
      for (var i = 0; i < response.data.children.length; i++) {
        const line = `\`${i + 1}\`. ${response.data.children[i].metadata.legend_name}\n`
        description = description.concat(line)
      }

      embed.setDescription(description)
      channel.send(embed).then(() => channel.stopTyping())
    }
  }

  displayLegend (channel, result, response) {
    channel.startTyping()
    const embed = new SwitchbladeEmbed()
      .setAuthor(response.data.metadata.platformUserHandle)
      .setTitle(response.data.metadata.legend_name)
      .addField(response.data.children[result].stats[0].metadata.name, response.data.children[result].stats[0].displayValue, true)
      .addField(response.data.children[result].stats[1].metadata.name, response.data.children[result].stats[1].displayValue, true, true)
      .addField(response.data.children[result].stats[2].metadata.name, response.data.children[result].stats[2].displayValue, true, true)
      .addField('Rank', response.data.children[result].stats[0].displayRank, true)
      .addField('Rank', response.data.children[result].stats[1].displayRank, true)
      .addField('Rank', response.data.children[result].stats[2].displayRank, true)
    channel.send(embed).then(() => channel.stopTyping())
  }
}
