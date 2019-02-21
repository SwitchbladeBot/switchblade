const { Constants, CommandStructures, SwitchbladeEmbed } = require('../../../')
const { Command, CommandParameters, StringParameter, CommandError } = CommandStructures

const platforms = { xbox: '1', psn: '2', origin: '5', pc: '5' }

module.exports = class ApexLegendsPlayer extends Command {
  constructor (client, parentCommand) {
    super(client, parentCommand || 'apexlegends')
    this.name = 'player'
    this.aliases = ['user', 'p']
    this.embedColor = Constants.APEX_LEGENDS_COLOR

    this.parameters = new CommandParameters(this,
      new StringParameter({
        required: true,
        whitelist: platforms,
        missingError: 'commands:apexlegends.noPlatform'
      }),
      new StringParameter({ required: true, missingError: 'commands:apexlegends.noPlayer' })
    )
  }

  async run ({ t, channel, author, language }, platform, player) {
    channel.startTyping()
    // TODO: DONE - Handling user not found error
    // TODO: DONE - Handle invalid platform requests
    // TODO: DONE - Create a map with key value pairs for each available platform - user experience
    // TODO: Determine if the player has multiple legends
    // if data.children has multiple objects ==> legends must be listed so the user can select one of them
    // TODO: List all of the legends
    // some form of loop, which displays all of the legends (legend names) of the user
    // TODO: Return the stats of the selected legend
    // TODO: Optional flag for lifetime stats of user
    //
    // TODO: display design idea for lifetime stats of user
    // Username
    // Platform - Value
    // Level - Value          Rank - Value
    // Kills - Value          Rank - Value
    // Damage done - Value    Rank - Value
    //
    //
    // TODO: display design idea for each legend:
    // Username
    // Legend name
    // Kills - Value          Rank - Value
    // Damage done - Value    Rank - Value
    // FullSquadWins - Value  Rank - Value
    // text = text.replace(/\s/g, '/')
    const endpoint = `${platforms[platform]}/${player}`
    const response = await this.client.apis.apexlegendsapi.request(endpoint)

    if (response.errors) {
      // TODO: Write the account not found string
      throw new CommandError(t(response.errors[0].message))
    } else {
      let description = '**Legends**\n\n'
      const embed = new SwitchbladeEmbed()
      embed.setTitle(response.data.metadata.platformUserHandle)
      for (var i = 0; i < response.data.children.length; i++) {
        const line = `${i + 1}. ${response.data.children[i].metadata.legend_name}\n`
        description = description.concat(line)
      }

      embed.setDescription(description)
      channel.send(embed).then(() => channel.stopTyping())
      const results = response.data.children.length
      const result = await this.awaitResponseMessage(author, channel, results, response)
      console.log(result)

    }
  }

  async awaitResponseMessage (author, channel, results, response) {
    const filter = c => c.author.equals(author) && this.verifyCollected(c.content, results.length)

    channel.awaitMessages(filter, { time: 10000, max: 1 })
      .then(collected => {
        if (collected.size > 0) {
          const result = results[Math.round(Number(collected.first().content)) - 1]
          this.handleResult(channel, result, response)
        }
      })
  }

  verifyCollected (selected, length) {
    const number = Math.round(Number(selected))
    return number <= length && !isNaN(number) && number > 0
  }

  handleResult (channel, result, response) {
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
